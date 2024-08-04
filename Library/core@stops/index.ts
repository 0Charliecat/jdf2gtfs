import path from 'path'
import { Stop, StopLocationType } from '../@isithere/gtfs_types/Stop'
import { JDF2GTFS } from '../..'
import { getContentsArray } from '../_app/_reusables/getContentsArray'


// Defined JDF Headers from Docs
const JDFHeaders = [ "id", "city", "borough", "name", "nearby_city", "country", "pk1", "pk2", "pk3", "pk4", "pk5", "pk6" ]

export default async function runtime(config: JDF2GTFS) {
	const { stop_ids, stop_codes, id_prefix, locations } = config
	const _Zastavky: JDFZastavkyObject[] = await getContentsArray(
		path.join(config.path, 'zastavky.txt'),
		JDFHeaders
	)

	let Entities: Map<string, Stop> = new Map()

	for (let _ of _Zastavky) {
		let location = locations.get(_.id)

		let computedStop = new Stop({
			id: stop_ids.has(_.id) ? stop_ids.get(_.id) : id_prefix+_.id,
			name: _StationNameConstructor(_),
			code: stop_codes.get(_.id),
			latitude: (location ?? [0,0])[1],
			longitude: (location ?? [0,0])[0],
			locationType: StopLocationType.Station
		})

		Entities.set(computedStop.id, computedStop)
	}

	for (let _ of config.platforms) {
		let computedPlatform = new Stop({
			id: stop_ids.has(_.parent) ? `${stop_ids.get(_.parent)}_${_.code}` : `${id_prefix}${_.parent}_${_.code}`,
			name: Entities.get(stop_ids.get(_.parent) ?? `${id_prefix}${_.parent}`)?.name ?? "",
			platformCode: _.code,
			locationType: StopLocationType.Platform,
			parentStation: stop_ids.get(_.parent) ?? `${id_prefix}${_.parent}`,
			latitude: _.location[1],
			longitude: _.location[0],
		})

		Entities.set(computedPlatform.id, computedPlatform)
	}

	return Entities
}

/**
 * Constructing force for Stop Names
 * @returns {String} i.e. Bratislava, Vajnory, MiÚ Vajnory
 */
function _StationNameConstructor(stop: JDFZastavkyObject) {
	let resultingName = [ stop.city, stop.borough, stop.name ]
	
	return resultingName
		.filter(str => (str ?? '').length !== 0)
		.join(", ")
}

interface JDFZastavkyObject {
	id: string;
	city?: string;
	borough?: string;
	name: string;
	nearby_city?: string;
	county?: string;
	PevnyKod_1: string;
	PevnyKod_2: string;
	PevnyKod_3: string;
	PevnyKod_4: string;
	PevnyKod_5: string;
	PevnyKod_6: string;
}