import { StopTime, StopTimeContinuous, StopTimePickDrop } from "@isithere/gtfs";
import { JDF2GTFS } from "../..";
import { getContentsArray } from '../_app/_reusables/getContentsArray'
import { Zasspoje, headers } from "../@isithere/jdf_types/Zasspoje";
import { pkArray } from "../core@pevnykod";
import { PevnyKodEnum, PevnyKodStopAttributes } from "../core@pevnykod/types";

export default async function runtime(config: JDF2GTFS) {
	const { id_prefix } = config
	const _Zasspoje: Zasspoje[] = await getContentsArray(
		config.getFile("zasspoje")!,
		headers
	)

	let Entities: Map<string, StopTime> = new Map()
	let _counter: { [x:string]: number } = {}

	for (let _ of _Zasspoje) {
		if (!isHHMM(_.departureTime, _.arrivalTime))
			continue;

		let tripId = `${id_prefix}${_.lineNumber}r${_.lineResolution}_${_.tripNumber}`
		if (!_counter[tripId]) _counter[tripId] = 0
		let _pk = pkArray([ _.pk_1, _.pk_2, _.pk_3 ])

		let computedStopTime = new StopTime({
			trip: tripId,
			stop: id_prefix+_.stopId,
			departure: convertTimeFormat(_.departureTime),
			arrival: convertTimeFormat(_.arrivalTime),
			stopSequence: _counter[tripId]++,
			pickUp: convertPickUpType(_pk),
			dropOff: convertDropOffType(_pk),
		})

		Entities.set(computedStopTime.toString(), computedStopTime)
	}

	return Entities
}

function isHHMM(departureTime: string, arrivalTime: string): boolean {
	return /\d{4}/.test(departureTime) && /\d{4}/.test(arrivalTime)
}

function convertPickUpType(pk: PevnyKodEnum[]): StopTimePickDrop {

	if (pk.includes(PevnyKodStopAttributes.DropOffOnly)) return StopTimePickDrop.NoStop
	if (pk.includes(PevnyKodStopAttributes.PickUpOnly)) return StopTimePickDrop.Regular
	if (pk.includes(PevnyKodStopAttributes.IsBorderCheck)) return StopTimePickDrop.NoStop
	if (pk.includes(PevnyKodStopAttributes.MustArrangeWithAgency)) return StopTimePickDrop.PhoneAgency
	if (pk.includes(PevnyKodStopAttributes.OnRequest)) return StopTimePickDrop.CoordinateDriver

	return StopTimePickDrop.Regular
}

function convertDropOffType(pk: PevnyKodEnum[]): StopTimePickDrop {

	if (pk.includes(PevnyKodStopAttributes.PickUpOnly)) return StopTimePickDrop.NoStop
	if (pk.includes(PevnyKodStopAttributes.DropOffOnly)) return StopTimePickDrop.Regular
	if (pk.includes(PevnyKodStopAttributes.IsBorderCheck)) return StopTimePickDrop.NoStop
	if (pk.includes(PevnyKodStopAttributes.MustArrangeWithAgency)) return StopTimePickDrop.PhoneAgency
	if (pk.includes(PevnyKodStopAttributes.OnRequest)) return StopTimePickDrop.CoordinateDriver

	return StopTimePickDrop.Regular
}

function convertTimeFormat(hhmm: string): string {
	return `${hhmm.slice(0,2)}:${hhmm.slice(2)}:00`
}