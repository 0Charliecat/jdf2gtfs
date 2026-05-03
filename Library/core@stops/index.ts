import { Stop, StopLocationType } from '@isithere/gtfs'
import { JDF2GTFS } from '../..'
import { getContentsArray } from '../_app/_reusables/getContentsArray'
import { Zastavky, headers } from '../@isithere/jdf_types/Zastavky'
import { Oznacniky, headers as oznacnikyHeaders } from '../@isithere/jdf_types/Oznacniky'

export default async function runtime(config: JDF2GTFS) {
	const { stop_ids, stop_codes, id_prefix, locations } = config
	const _Zastavky: Zastavky[] = await getContentsArray(
		config.getFile("zastavky")!,
		headers
	)
	const _Oznacniky: Oznacniky[] = await getContentsArray(
		config.getFile("oznacniky") ?? Buffer.from([]),
		oznacnikyHeaders
	)

	let Entities: Map<string, Stop> = new Map()

	for (let z of _Zastavky) {
		config.stopNames.set(z.stopID, _StationNameConstructor(z))
	}

	if (_Oznacniky.length != 0) {
		for (let _ of _Oznacniky) {
			let stopName = config.featureFlags.useParentStopNameForPlatforms ?
				_StationNameConstructor(_Zastavky.find(z => z.stopID == _.stopId)!) :
				_.name
			let location = locations.get(`${_.stopId}_${_.stand}`) ?? locations.get(`${_.stopId}_${_.markerCode}`) ?? locations.get(`${_.stopId}`) ?? [0,0]

			let computedPlatform = new Stop({
				id: `${id_prefix}${_.stopId}_${_.markerCode.length != 0 ? _.markerCode : _.stand}`,
				name: stopName,
				platformCode: _.stand,
				locationType: StopLocationType.Platform,
				parentStation: config.parentStops.includes(_.stopId) ? `${id_prefix}${_.stopId}` : undefined,
				latitude: location[1],
				longitude: location[0],
				description: _.direction,
				directionName: _.direction,
				signpostedAs: `${stopName} [${_.stand}]`,
				code: stop_codes?.get(`${_.stopId}_${_.stand}`) ?? stop_codes?.get(`${_.stopId}_${_.markerCode}`) ?? stop_codes?.get(`${_.stopId}`) ?? (config.featureFlags.showCISCPCodeInStopCode ? _.stopId : undefined)
			})
			
			let requestEntityChanges = config.requestEntityChanges?.Stops({ gtfs: computedPlatform, jdfOznacniky: _ })
			if (requestEntityChanges)
				computedPlatform = Object.assign(computedPlatform, requestEntityChanges)

			Entities.set(computedPlatform.id, computedPlatform)
		}
	} else if (config.platforms.length > 0) {
		for (let _ of config.platforms) {
			let computedPlatform = new Stop({
				id: stop_ids.has(_.parent) ? `${stop_ids.get(_.parent)}_${_.code}` : `${id_prefix}${_.parent}_${_.code}`,
				name: _StationNameConstructor(_Zastavky.find(z => z.stopID == _.parent)!),
				platformCode: _.code,
				locationType: StopLocationType.Platform,
				//parentStation: stop_ids.get(_.parent) ?? `${id_prefix}${_.parent}`,
				parentStation: config.parentStops.includes(_.parent) ? `${id_prefix}${_.parent}` : undefined,
				latitude: _.location[1],
				longitude: _.location[0],
			})

			let requestEntityChanges = config.requestEntityChanges?.Stops({ gtfs: computedPlatform, platform: _ })
			if (requestEntityChanges)
				computedPlatform = Object.assign(computedPlatform, requestEntityChanges)

			Entities.set(computedPlatform.id, computedPlatform)
		}
	}
	
	for (let stopId of config.parentStops) {
		let stopData = _Zastavky.find(z => z.stopID == stopId)
		if (!stopData) continue

		let location = locations.get(stopId) ?? [0,0]

		let computedStop = new Stop({
			id: stop_ids.get(stopId) ?? `${id_prefix}${stopId}`,
			name: _StationNameConstructor(stopData),
			code: stop_codes?.get(stopId) ?? (config.featureFlags.showCISCPCodeInStopCode ? stopId : undefined),
			latitude: location[1],
			longitude: location[0],
			locationType: StopLocationType.Station
		})

		let requestEntityChanges = config.requestEntityChanges?.Stops({ gtfs: computedStop, jdfZastavky: stopData })
		if (requestEntityChanges)
			computedStop = Object.assign(computedStop, requestEntityChanges)

		config.stopNames.set(stopData.stopID, computedStop.name!)
		Entities.set(computedStop.id, computedStop)
	}

	let unOznacikoveStops = _Zastavky.filter(z => !config.parentStops.includes(z.stopID) && !_Oznacniky.some(o => o.stopId == z.stopID))
	for (let stopData of unOznacikoveStops) {
		let location = locations.get(stopData.stopID) ?? [0,0]

		let computedStop = new Stop({
			id: stop_ids.get(stopData.stopID) ?? `${id_prefix}${stopData.stopID}`,
			name: _StationNameConstructor(stopData),
			code: stop_codes?.get(stopData.stopID) ?? (config.featureFlags.showCISCPCodeInStopCode ? stopData.stopID : undefined),
			latitude: location[1],
			longitude: location[0],
			locationType: StopLocationType.Platform
		})

		let requestEntityChanges = config.requestEntityChanges?.Stops({ gtfs: computedStop, jdfZastavky: stopData })
		if (requestEntityChanges)
			computedStop = Object.assign(computedStop, requestEntityChanges)

		config.stopNames.set(stopData.stopID, computedStop.name!)
		Entities.set(computedStop.id, computedStop)
	}

	return Entities
}

/**
 * Constructing force for Stop Names
 * @returns {string} i.e. Bratislava, Vajnory, MiÚ Vajnory
 */
function _StationNameConstructor(stop: Zastavky) {
	let resultingName = [ stop.localityName, stop.localityPart, stop.nearPlace ]
	
	return resultingName
		.filter(str => (str ?? '').length !== 0)
		.join(", ")
}