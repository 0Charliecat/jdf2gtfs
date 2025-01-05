import { Stop, StopLocationType } from '@isithere/gtfs'
import { JDF2GTFS } from '../..'
import { getContentsArray } from '../_app/_reusables/getContentsArray'
import { Zastavky, headers } from '../@isithere/jdf_types/Zastavky'

export default async function runtime(config: JDF2GTFS) {
	const { stop_ids, stop_codes, id_prefix, locations } = config
	const _Zastavky: Zastavky[] = await getContentsArray(
		config.getFile("zastavky")!,
		headers
	)

	let Entities: Map<string, Stop> = new Map()

	for (let _ of _Zastavky) {
		let location = locations.get(_.stopID)

		let computedStop = new Stop({
			id: id_prefix+_.stopID,
			name: _StationNameConstructor(_),
			code: stop_codes.get(_.stopID) ?? undefined,
			latitude: (location ?? [0,0])[1],
			longitude: (location ?? [0,0])[0],
			locationType: StopLocationType.Station
		})

		let requestEntityChanges = config.requestEntityChanges?.Stops({ gtfs: computedStop, jdf: _ })
		if (requestEntityChanges)
			computedStop = Object.assign(computedStop, requestEntityChanges)

		Entities.set(computedStop.id, computedStop)
	}

	for (let _ of config.platforms) {
		let computedPlatform = new Stop({
			id: stop_ids.has(_.parent) ? `${stop_ids.get(_.parent)}_${_.code}` : `${id_prefix}${_.parent}_${_.code}`,
			name: `${Entities.get(`${id_prefix}${_.parent}`)?.name ?? ""} Platform ${_.code}`,
			platformCode: _.code,
			locationType: StopLocationType.Platform,
			parentStation: stop_ids.get(_.parent) ?? `${id_prefix}${_.parent}`,
			latitude: _.location[1],
			longitude: _.location[0],
		})

		let requestEntityChanges = config.requestEntityChanges?.Stops({ gtfs: computedPlatform, platform: _ })
		if (requestEntityChanges)
			computedPlatform = Object.assign(computedPlatform, requestEntityChanges)

		Entities.set(computedPlatform.id, computedPlatform)
	}

	return Entities
}

/**
 * Constructing force for Stop Names
 * @returns {String} i.e. Bratislava, Vajnory, MiÚ Vajnory
 */
function _StationNameConstructor(stop: Zastavky) {
	let resultingName = [ stop.localityName, stop.localityPart, stop.nearPlace ]
	
	return resultingName
		.filter(str => (str ?? '').length !== 0)
		.join(", ")
}