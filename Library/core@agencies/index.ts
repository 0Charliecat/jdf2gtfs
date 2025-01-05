import path from "path";
import { JDF2GTFS } from "../.."
import { getContentsArray } from "../_app/_reusables/getContentsArray";
import { Agency } from "@isithere/gtfs";
import { Dopravci, headers } from "../@isithere/jdf_types/Dopravci"

export default async function runtime(config: JDF2GTFS) {
	const { id_prefix, timezone, lang } = config
	const _Dopravci: Dopravci[] = await getContentsArray(
		config.getFile("dopravci")!,
		headers
	)

	let Entities: Map<string, Agency> = new Map()

	for (let _ of _Dopravci) {
		let computedAgency = new Agency({
			id: getAgencyID(id_prefix, _.agencyID, _.agencyResolution),
			name: _.name,
			url: _.website,
			timezone,
			lang,
			phone: _.phoneOffice,
			email: _.email
		})

		let requestEntityChanges = config.requestEntityChanges?.Agencies({ gtfs: computedAgency, jdf: _ })
		if (requestEntityChanges)
			computedAgency = Object.assign(computedAgency, requestEntityChanges)

		Entities.set(computedAgency.id, computedAgency)
	}

	return Entities
}

export function getAgencyID(id_prefix: string, agencyID: string, agencyResolution: string) {
	return `${id_prefix}${agencyID}_r${agencyResolution}`
}