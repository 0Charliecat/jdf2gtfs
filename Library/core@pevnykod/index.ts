import { JDF2GTFS } from "../.."
import { getContentsArray } from "../_app/_reusables/getContentsArray";
import { PevnyKodEnum } from "./types";
import { PevnyKod, headers } from "../@isithere/jdf_types/PevnyKod";

export const PK: Map<string, PevnyKodEnum | string> = new Map()

export async function SetupPevnyKod(config: JDF2GTFS) {
	const _Pevnykod: PevnyKod[] = await getContentsArray(
		config.getFile("pevnykod")!,
		headers
	)

	for (let _ of _Pevnykod) {
		PK.set(_.key, _.value)
	}
}

export function pkArray(kody: string[]): (PevnyKodEnum)[] {
	return kody
		.filter(kod => kod.length !== 0)
		.map(kod => {
			return PK.get(kod)
		}) as (PevnyKodEnum)[]
}