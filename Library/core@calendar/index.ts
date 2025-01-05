import { Calendar } from "@isithere/gtfs";
import { JDF2GTFS } from '../..'
import { getContentsArray } from '../_app/_reusables/getContentsArray'
import { Spoje, headers as spojeHeaders } from '../@isithere/jdf_types/Spoje'
import { Linky, headers as linkyHeaders } from '../@isithere/jdf_types/Linky'
import { pkArray } from "../core@pevnykod";
import { PevnyKodTripExecution } from "../core@pevnykod/types";

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

	let Entities: Map<string, Calendar> = new Map()

	for (let _ of _Spoje) {
		let key = `${id_prefix}${_.lineNumber}r${_.lineResolution}_${_.tripNumber}_C`
		let _linka = _Linky.find(l => l.number === _.lineNumber && l.lineResolution === _.lineResolution)
		if (!_linka)
			throw new Error(`CALENDAR | Can't find a line for trip "${key.replace('_C', '')}"`)

		let _pk = pkArray([ _.pk_1, _.pk_2, _.pk_3, _.pk_4, _.pk_5, _.pk_6, _.pk_7, _.pk_8, _.pk_9, _.pk_10 ])
		let workdays = _pk.includes(PevnyKodTripExecution.OnlyWorkdays)

		let computedCalendar = new Calendar({
			id: key,

			start: dateConverter(_linka.validFrom),
			end: dateConverter(_linka.validUntil),

			monday: workdays || _pk.includes(PevnyKodTripExecution.OnlyMondays),
			tuesday: workdays || _pk.includes(PevnyKodTripExecution.OnlyTuesdays),
			wednesday: workdays || _pk.includes(PevnyKodTripExecution.OnlyWednesdays),
			thursday: workdays || _pk.includes(PevnyKodTripExecution.OnlyThursdays),
			friday: workdays || workdays || _pk.includes(PevnyKodTripExecution.OnlyFridays),
			saturday: _pk.includes(PevnyKodTripExecution.OnlySaturdays),
			sunday: _pk.includes(PevnyKodTripExecution.OnlySundays) || _pk.includes(PevnyKodTripExecution.OnlyFreedays)
		})

		Entities.set(key, computedCalendar)
	}

	return Entities
}

function dateConverter(ddmmyyyy: string) {
	let yyyy = ddmmyyyy.substring(4, 8)
	let mm = ddmmyyyy.substring(2, 4)
	let dd = ddmmyyyy.substring(0, 2)
	return (new Date(parseInt(yyyy), parseInt(mm) - 1, parseInt(dd), 0, 0, 0))
}
