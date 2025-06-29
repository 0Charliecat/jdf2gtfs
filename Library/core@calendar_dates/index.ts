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
		let _linka = _Linky.find(l => l.number === _.lineNumber && l.lineResolution === _.lineResolution)
		if (!_linka)
			throw new Error(`CALENDAR | Can't find a line for trip "${key.replace('_C', '')}"`)
		let _casKod = _CasKody.filter(c => c.lineNumber === _.lineNumber && c.lineResolution === _.lineResolution && c.tripNumber === _.tripNumber) ?? []
		
		let _pk = pkArray([ _.pk_1, _.pk_2, _.pk_3, _.pk_4, _.pk_5, _.pk_6, _.pk_7, _.pk_8, _.pk_9, _.pk_10 ])
		
		let _calendarDates: Date[] = getDaysArray(dateConverter(_linka.validFrom), dateConverter(_linka.validUntil))
			.filter(d => dateFilter(_pk, d))
		let _calendarChanges: { date: Date, exception: CalendarDateExcpetion }[] = []

		let casKodIsJedeJen = !!_casKod.find(c => c.exceptionType === CasKodTyp.ONLY_GOES)
		if (casKodIsJedeJen) {
			// In this case no interval restrictions can be used
			// "jede jen" has only single date-specific days allowed 
			// and cannot be combined with any other fixed code or any other CasKod Type
			_calendarDates = []
			for (let _c of _casKod) {
				if (_c.exceptionType !== CasKodTyp.ONLY_GOES) continue
				_calendarChanges.push({ date: dateConverter(_c.dateFrom!), exception: CalendarDateExcpetion.Added })
				_calendarDates.push(dateConverter(_c.dateFrom!))

			}

			continue;
			// TODO: add killer for the rest of the days in the calendar
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
			
			_calendarDates = _calendarDates.filter(d => dateRange.includes(d))
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
				_calendarDates = _calendarDates.filter(d => d === dateConverter(_c.dateFrom!))
				_calendarChanges.push({ date: dateConverter(_c.dateFrom!), exception: CalendarDateExcpetion.Removed })
			}
			else {
				let dateRange: Date[] = getDaysArray(dateConverter(_c.dateFrom!), dateConverter(_c.dateUntil!))
				_calendarDates = _calendarDates.filter(d => !dateRange.includes(d))
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

// TODO: Watch if this function is correct
function dateFilter(allowedCases: PevnyKodEnum[], date: Date) {
	let satified = true

	for (let _ of allowedCases) {
		switch (_) {
			case PevnyKodTripExecution.OnlyWorkdays:
				if (!isHoliday(date)) satified = false
				if (date.getDay() != 0 || date.getDay() != 6) satified = false
				break;
			case PevnyKodTripExecution.OnlyFreedays:
				if (!isHoliday(date)) satified = false
				if (date.getDay() !== 0) satified = false
				break;
			case PevnyKodTripExecution.OnlyMondays:
				if (isHoliday(date)) satified = false
				if (date.getDay() !== 1) satified = false
				break;
			case PevnyKodTripExecution.OnlyTuesdays:
				if (isHoliday(date)) satified = false
				if (date.getDay() !== 2) satified = false
				break;
			case PevnyKodTripExecution.OnlyWednesdays:
				if (isHoliday(date)) satified = false
				if (date.getDay() !== 3) satified = false
				break;
			case PevnyKodTripExecution.OnlyThursdays:
				if (isHoliday(date)) satified = false
				if (date.getDay() !== 4) satified = false
				break;
			case PevnyKodTripExecution.OnlyFridays:
				if (isHoliday(date)) satified = false
				if (date.getDay() !== 5) satified = false
				break;
			case PevnyKodTripExecution.OnlySaturdays:
				if (isHoliday(date)) satified = false
				if (date.getDay() !== 6) satified = false
				break;
			case PevnyKodTripExecution.OnlySundays:
				if (isHoliday(date)) satified = false
				if (date.getDay() !== 0) satified = false
				break;
		}
	}

	return satified
}