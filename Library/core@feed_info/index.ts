import { JDF2GTFS } from "../.."
import { getContentsArray } from "../_app/_reusables/getContentsArray";
import { VerzeJDF, headers } from "../@isithere/jdf_types/VerzeJDF";
import { FeedInfo } from "@isithere/gtfs";
import { Linky, headers as headers_Linky } from "../@isithere/jdf_types/Linky";
import { dateConverter } from "../_app/_reusables/dateConverter";

export default async function runtime(config: JDF2GTFS) {
	const _VerzeJDF: VerzeJDF[] = await getContentsArray(
		config.getFile('verzejdf')!,
		headers
	)
	const _Linky: Linky[] = await getContentsArray(
		config.getFile("linky")!,
		headers_Linky
	)

	let Entity: FeedInfo = new FeedInfo({
		publisherName: config.feed_info.feed_publisher_name,
		publisherUrl: config.feed_info.feed_puiblisher_url,
		lang: config.feed_info.feed_lang,
		start: new Date(config.feed_info.feed_start_date!),
		end: new Date(config.feed_info.feed_end_date!),
		version: config.feed_info.feed_version,
		contactEmail: config.feed_info.feed_contact_email,
		contactUrl: config.feed_info.feed_contact_url,
	})

	if (config.featureFlags.useVerzeJDFIDAsFeedVersion)
		Entity.version = _VerzeJDF[0].version ?? _VerzeJDF[0].feedID

	if (config.featureFlags.useTTValitityAsFeedValidity) {
		Entity.start = new Date(Math.min(..._Linky.map(l => dateConverter(l.validFrom).getTime())))
		Entity.end = new Date(Math.max(..._Linky.map(l => dateConverter(l.validUntil).getTime())))
	}

	return Entity
}