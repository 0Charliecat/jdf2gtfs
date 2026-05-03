import { StopTime, StopTimeContinuous, StopTimePickDrop } from "@isithere/gtfs";
import { JDF2GTFS } from "../..";
import { getContentsArray } from '../_app/_reusables/getContentsArray'
import { Zasspoje, headers } from "../@isithere/jdf_types/Zasspoje";
import { pkArray } from "../core@pevnykod";
import { PevnyKodEnum, PevnyKodStopAttributes } from "../core@pevnykod/types";

export default async function runtime(config: JDF2GTFS) {
	const { id_prefix } = config
	const _Zasspoje: { [tripNumber: string]: Zasspoje[] } = (await getContentsArray(
		config.getFile("zasspoje")!,
		headers
	)).reduce((acc, _) => {
		if (!acc[`${_.lineNumber}_${_.tripNumber}r${_.lineResolution}`]) acc[`${_.lineNumber}_${_.tripNumber}r${_.lineResolution}`] = []
		acc[`${_.lineNumber}_${_.tripNumber}r${_.lineResolution}`].push(_)
		return acc
	}, {} as { [tripNumber: string]: Zasspoje[] })
		

	let Entities: Map<string, StopTime> = new Map()

	for (let tripNumber in _Zasspoje) {
		let tripId = `${id_prefix}${_Zasspoje[tripNumber][0].lineNumber}r${_Zasspoje[tripNumber][0].lineResolution}_${_Zasspoje[tripNumber][0].tripNumber}`
		let isOverMidnight = !isSortedAscending(
			_Zasspoje[tripNumber]
				.map(_ => {
					const d = /\d{4}/.test(_.departureTime) ? parseInt(_.departureTime) : NaN
					const a = /\d{4}/.test(_.arrivalTime)  ? parseInt(_.arrivalTime)  : NaN
					return !isNaN(d) ? d : a
				})
				.filter(_ => !Number.isNaN(_))
		)

		if (isOverMidnight) {
			let midnightOffset = 0
			let prevTime = -1

			for (let i = 0; i < _Zasspoje[tripNumber].length; i++) {
				const stop = _Zasspoje[tripNumber][i]
				if (!isHHMM(stop.departureTime, stop.arrivalTime)) continue

				const rawDept = /\d{4}/.test(stop.departureTime) ? parseInt(stop.departureTime) : NaN
				const rawArr  = /\d{4}/.test(stop.arrivalTime)  ? parseInt(stop.arrivalTime)  : NaN

				// Use departure as reference for crossing detection; fall back to arrival
				const refTime = !isNaN(rawDept) ? rawDept : rawArr
				if (isNaN(refTime)) continue

				if (prevTime >= 0 && refTime + midnightOffset < prevTime)
					midnightOffset += 2400

				if (!isNaN(rawArr))  _Zasspoje[tripNumber][i].arrivalTime   = String(rawArr  + midnightOffset)
				if (!isNaN(rawDept)) _Zasspoje[tripNumber][i].departureTime = String(rawDept + midnightOffset)

				prevTime = refTime + midnightOffset
			}
		}

		for (let i = 0; i < _Zasspoje[tripNumber].length; i++) {
			let _ = _Zasspoje[tripNumber][i]
			if (!isHHMM(_.departureTime, _.arrivalTime))
				continue;
			
			let stopId = `${id_prefix}${_.stopId}`
			let platformId = `${id_prefix}${_.stopId}_${_.platformId.length > 0 ? _.platformId : _.platformCode}`
			let _pk = pkArray([ _.pk_1, _.pk_2, _.pk_3 ])

			let computedStopTime = new StopTime({
				trip: tripId,
				stop: config.getStop(platformId) ? platformId : stopId,
				departure: convertTimeFormat(_.departureTime) ?? convertTimeFormat(_.arrivalTime)!,
				arrival: convertTimeFormat(_.arrivalTime) ?? convertTimeFormat(_.departureTime)!,
				stopSequence: i+1,
				pickUp: convertPickUpType(_pk),
				dropOff: convertDropOffType(_pk),
				timepoint: 0
			})

			let requestEntityChanges = config.requestEntityChanges?.StopTimes({ gtfs: computedStopTime, jdf: _ })
			if (requestEntityChanges)
				computedStopTime = Object.assign(computedStopTime, requestEntityChanges)

			Entities.set(computedStopTime.toString(), computedStopTime)
		}
	}

	return Entities
}

function isHHMM(departureTime: string, arrivalTime: string): boolean {
	return /\d{4}/.test(departureTime) || /\d{4}/.test(arrivalTime)
}

function convertPickUpType(pk: PevnyKodEnum[]): StopTimePickDrop {
	if (pk.includes(PevnyKodStopAttributes.DropOffOnly)) return StopTimePickDrop.NoStop
	else if (pk.includes(PevnyKodStopAttributes.PickUpOnly)) return StopTimePickDrop.Regular
	else if (pk.includes(PevnyKodStopAttributes.IsBorderCheck)) return StopTimePickDrop.NoStop
	else if (pk.includes(PevnyKodStopAttributes.MustArrangeWithAgency)) return StopTimePickDrop.PhoneAgency
	else if (pk.includes(PevnyKodStopAttributes.OnRequest)) return StopTimePickDrop.CoordinateDriver
	else return StopTimePickDrop.Regular
}

function convertDropOffType(pk: PevnyKodEnum[]): StopTimePickDrop {
	if (pk.includes(PevnyKodStopAttributes.PickUpOnly)) return StopTimePickDrop.NoStop
	else if (pk.includes(PevnyKodStopAttributes.DropOffOnly)) return StopTimePickDrop.Regular
	else if (pk.includes(PevnyKodStopAttributes.IsBorderCheck)) return StopTimePickDrop.NoStop
	else if (pk.includes(PevnyKodStopAttributes.MustArrangeWithAgency)) return StopTimePickDrop.PhoneAgency
	else if (pk.includes(PevnyKodStopAttributes.OnRequest)) return StopTimePickDrop.CoordinateDriver
	else return StopTimePickDrop.Regular
}

function convertTimeFormat(hhmm: string): (string|null) {
	if (hhmm.length !== 4) return null
	else return `${hhmm.slice(0,2)}:${hhmm.slice(2)}:00`
}

function isSortedAscending(arr: number[]): boolean {
	for (let i = 0; i < arr.length - 1; i++) {
		if (arr[i] >= arr[i + 1]) return false;
	}
	return true;
}