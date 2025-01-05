import path from "path";
import { JDF2GTFS } from "../.."
import { getContentsArray } from "../_app/_reusables/getContentsArray";
import { Trip, TripBikesAllowed, TripWheelchairAccessibility } from '@isithere/gtfs'
import { pkArray } from "../core@pevnykod";
import { PevnyKodTripModificators } from "../core@pevnykod/types";
import { Spoje, headers } from "../@isithere/jdf_types/Spoje";
import { Zasspoje, headers as zasspojeHeaders } from "../@isithere/jdf_types/Zasspoje";

export default async function runtime(config: JDF2GTFS) {
	const { id_prefix } = config

	const _Spoje: Spoje[] = await getContentsArray(
		config.getFile('spoje')!,
		headers
	)
	const _Zasspoje: Zasspoje[] = await getContentsArray(
		config.getFile('zasspoje')!,
		zasspojeHeaders
	)


	let Entities: Map<string, Trip> = new Map()

	for (let _ of _Spoje) {
		let key = `${id_prefix}${_.lineNumber}r${_.lineResolution}_${_.tripNumber}`

		let headsign = config.getStop(_Zasspoje[_Zasspoje.length - 1].stopId)?.name
		if (!headsign)
			throw new Error(`TRIP | Can't set headsign for trip "${key}" because stop "${_Zasspoje[_Zasspoje.length - 1].stopId}" has not been found in Converting Context.`)
		let _pk = pkArray([ _.pk_1, _.pk_2, _.pk_3, _.pk_4, _.pk_5, _.pk_6, _.pk_7, _.pk_8, _.pk_9, _.pk_10 ])

		let computedTrip = new Trip({
			id: key,
			service: key+"_C",
			route: `${id_prefix}${_.lineNumber}r${_.lineResolution}`,
			headsign,
			shortName: `${headsign} (Spoj ${_.tripNumber})`,
			wheelchairAccessible: _pk.includes(PevnyKodTripModificators.TripIsAccessible) ? TripWheelchairAccessibility.Some : TripWheelchairAccessibility.NoInformation,
			bikesAllowed: _pk.includes(PevnyKodTripModificators.TripAllowsBikes) ? TripBikesAllowed.Allowed : TripBikesAllowed.NoInformation
		})

		Entities.set(key, computedTrip)
	}

	return Entities
}