import path from "path";
import { JDF2GTFS } from "../.."
import { getContentsArray } from "../_app/_reusables/getContentsArray";
import { Agency } from "../@isithere/gtfs_types/Agency";

// Defined JDF Headers from Docs
const JDFHeaders = [ "id", "DIC", "name", "_02", "_03", "address", "mainPhoneNumber", "traficPhoneNumber", "infoPhoneNumber", "fax", "email", "web", "ext" ] // TODO: docs show a diff than the files used in testing

export default async function runtime(config: JDF2GTFS) {
	const { id_prefix, feed_info, timezone, lang } = config
	const _Dopravci: JDFDopravciObject[] = await getContentsArray(
		path.join(config.path, 'dopravci.txt'),
		JDFHeaders
	)

	let Entities: Map<string, Agency> = new Map()

	for (let _ of _Dopravci) {
		let computedAgency = new Agency({
			id: id_prefix+_.id,
			name: _.name,
			url: _.web,
			timezone,
			lang,
			phone: _.mainPhoneNumber,
			email: _.email
		})

		Entities.set(computedAgency.id, computedAgency)
	}

	return Entities
}

interface JDFDopravciObject {
	id: string,
	DIC: string,
	name: string,
	_02?: any,
	_03?: any,
	address: string;
	mainPhoneNumber: string;
	traficPhoneNumber?: string;
	infoPhoneNumber?: string;
	fax?: string;
	email?: string;
	web?: string;
	ext?: string;
}