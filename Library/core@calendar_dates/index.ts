import { CalendarDate, CalendarDateExcpetion } from "@isithere/gtfs";
import { JDF2GTFS } from '../..'
import { getContentsArray } from '../_app/_reusables/getContentsArray'
import { Spoje, headers as spojeHeaders } from '../@isithere/jdf_types/Spoje'
import { Linky, headers as linkyHeaders } from '../@isithere/jdf_types/Linky'
import { CasKodTyp, CasKody, headers as casKodyHeaders } from '../@isithere/jdf_types/CasKody'
import { pkArray } from "../core@pevnykod";
import { PevnyKodEnum, PevnyKodTripExecution } from "../core@pevnykod/types";
import { isHoliday } from "slovak-holidays";
import { dateConverter } from "../_app/_reusables/dateConverter";

export default async function runtime(config: JDF2GTFS) {
	const { id_prefix } = config

	const _Spoje: Spoje[] = await getContentsArray(
		config.getFile('spoje')!,
		spojeHeaders
	)

	const _Linky: Linky[] = await getContentsArray(
		config.getFile('linky')!,
		linkyHeaders
	)

	const _CasKody: CasKody[] = await getContentsArray(
		config.getFile('caskody')!,
		casKodyHeaders
	)

	let Entities: Map<string, CalendarDate> = new Map()
	let counter = 0

	for (let _ of _Spoje) {
		let key = `${id_prefix}${_.lineNumber}r${_.lineResolution}_${_.tripNumber}_C`
		let _linka = _Linky.find(l => l.number === _.lineNumber && String(l.lineResolution) === _.lineResolution)
		if (!_linka)
			throw new Error(`CALENDAR | Can't find a line for trip "${key.replace('_C', '')}"`)
		let _casKod = _CasKody.filter(c => c.lineNumber === _.lineNumber && String(c.lineResolution) === _.lineResolution && c.tripNumber === _.tripNumber) ?? []
		
		let _pk = pkArray([ _.pk_1, _.pk_2, _.pk_3, _.pk_4, _.pk_5, _.pk_6, _.pk_7, _.pk_8, _.pk_9, _.pk_10 ])
		
		let _calendarDates: Date[] = getDaysArray(dateConverter(_linka.validFrom), dateConverter(_linka.validUntil))
			.filter(d => dateFilter(_pk, d))
		let _calendarChanges: { date: Date, exception: CalendarDateExcpetion }[] = []

		let casKodIsJedeJen = !!_casKod.find(c => c.exceptionType === CasKodTyp.ONLY_GOES)
		if (casKodIsJedeJen) {
			// "jede jen" — trip runs only on these specific dates, no weekly pattern.
			// Cannot be combined with any other CasKod type per spec.
			for (let _c of _casKod) {
				if (_c.exceptionType !== CasKodTyp.ONLY_GOES) continue
				const d = dateConverter(_c.dateFrom!)
				Entities.set(counter + "", new CalendarDate({ service: key, date: d, exception: CalendarDateExcpetion.Added }))
				counter++
			}
			await config.softDestroyCalendar(key)
			continue;
		}

		let casKodJede = _casKod.filter(c => c.exceptionType === CasKodTyp.GOES)
		let casKodJedeTake = _casKod.filter(c => c.exceptionType === CasKodTyp.ALSO_GOES)
		let casKodNejede = _casKod.filter(c => c.exceptionType === CasKodTyp.DOES_NOT_GO)

		for (let _c of casKodJede) {
			// Implamentation of "jede" type can be not up to Creator Vision
			// This is only a guess
			// TODO: Fix this mess
			let dateRange: Date[] = getDaysArray(dateConverter(_c.dateFrom!), dateConverter(_c.dateUntil!))
				.filter(d => dateFilter(_pk, d))
			
			const rangeMs = new Set(dateRange.map(d => d.getTime()))
			_calendarDates = _calendarDates.filter(d => rangeMs.has(d.getTime()))
			_calendarChanges.push(...dateRange.map(d => ({ date: d, exception: CalendarDateExcpetion.Added })))
		}

		for (let _c of casKodJedeTake) {
			// In this case no interval restrictions can be used
			// "jede také" has only single date-specific days allowed
			_calendarDates.push(dateConverter(_c.dateFrom!))
			_calendarChanges.push({ date: dateConverter(_c.dateFrom!), exception: CalendarDateExcpetion.Added })
		}

		for (let _c of casKodNejede) {
			// In this case no interval restrictions can be used
			// "nejede" has only single date-specific days allowed
			if (_c.dateUntil.length === 0) {
				const forbiddenDate = dateConverter(_c.dateFrom!)
				_calendarDates = _calendarDates.filter(d => d.getTime() !== forbiddenDate.getTime())
				_calendarChanges.push({ date: forbiddenDate, exception: CalendarDateExcpetion.Removed })
			}
			else {
				let dateRange: Date[] = getDaysArray(dateConverter(_c.dateFrom!), dateConverter(_c.dateUntil!))
				const rangeMs = new Set(dateRange.map(d => d.getTime()))
				_calendarDates = _calendarDates.filter(d => !rangeMs.has(d.getTime()))
				_calendarChanges.push(...dateRange.map(d => ({ date: d, exception: CalendarDateExcpetion.Removed })))
			}
		}
		


		for (let _d of _calendarChanges) {
			// if (!_calendarDates.includes(_d.date)) continue
			let _calendarDate = new CalendarDate({
				service: key,
				date: _d.date,
				exception: _d.exception
			})
			Entities.set(counter + "", _calendarDate)
			counter++
		}
		
	}

	return Entities
}

function getDaysArray(start: Date, end: Date) {
    const arr = [];
    for(const dt=new Date(start); dt<=new Date(end); dt.setDate(dt.getDate()+1)){
		//@ts-ignore // Code so great even TS Type Checker can't handle it
        arr.push(new Date(dt));
    }
    return arr;
};

// Returns true if the date falls on a day permitted by the trip's execution codes.
// Multiple codes are OR'd — the trip runs if any code matches.
// No execution codes means the trip runs every day in the validity range.
function dateFilter(allowedCases: PevnyKodEnum[], date: Date): boolean {
	const dayCodes = allowedCases.filter(
		(c): c is PevnyKodTripExecution => Object.values(PevnyKodTripExecution).includes(c as PevnyKodTripExecution)
	)

	if (dayCodes.length === 0) return true

	return dayCodes.some(code => matchesDayCode(code, date))
}

function matchesDayCode(code: PevnyKodTripExecution, date: Date): boolean {
	const day     = date.getDay()   // 0=Sun, 1=Mon … 6=Sat
	const holiday = !!isHoliday(date)
	switch (code) {
		// X — pracovní dny: Mon–Fri, excluding holidays
		case PevnyKodTripExecution.OnlyWorkdays:   return day >= 1 && day <= 5 && !holiday
		// + — neděle a státem uznané svátky: Sundays OR state holidays (any weekday)
		case PevnyKodTripExecution.OnlyFreedays:   return day === 0 || holiday
		// 1–6 — specific weekday, not on holidays (holidays shift to free-day schedule)
		case PevnyKodTripExecution.OnlyMondays:    return day === 1 && !holiday
		case PevnyKodTripExecution.OnlyTuesdays:   return day === 2 && !holiday
		case PevnyKodTripExecution.OnlyWednesdays: return day === 3 && !holiday
		case PevnyKodTripExecution.OnlyThursdays:  return day === 4 && !holiday
		case PevnyKodTripExecution.OnlyFridays:    return day === 5 && !holiday
		case PevnyKodTripExecution.OnlySaturdays:  return day === 6 && !holiday
		// 7 — neděle: any Sunday (Sunday is already a free day; holiday Sundays still match)
		case PevnyKodTripExecution.OnlySundays:    return day === 0
	}
}