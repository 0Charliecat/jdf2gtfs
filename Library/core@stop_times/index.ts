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
		if (!acc[`${_.lineNumber}_${_.tripNumber}`]) acc[`${_.lineNumber}_${_.tripNumber}`] = []
		acc[`${_.lineNumber}_${_.tripNumber}`].push(_)
		return acc
	}, {} as { [tripNumber: string]: Zasspoje[] })
		

	let Entities: Map<string, StopTime> = new Map()

	for (let tripNumber in _Zasspoje) {
		let tripId = `${id_prefix}${_Zasspoje[tripNumber][0].lineNumber}r${_Zasspoje[tripNumber][0].lineResolution}_${_Zasspoje[tripNumber][0].tripNumber}`
		let isOverMidnight = !isSortedAscending(
			_Zasspoje[tripNumber]
				.map(_ => _.departureTime.length != 0 ? parseInt(_.departureTime) : parseInt(_.arrivalTime))
				.filter(_ => !Number.isNaN(_))
		)

		if (isOverMidnight) {
			let pastNormalTime = 0
			for (let i = 1; i < _Zasspoje[tripNumber].length; i++) {
				let _ = _Zasspoje[tripNumber][i]
				if (!isHHMM(_.departureTime, _.arrivalTime)) {
					pastNormalTime = i - 1
					continue;
				}

				if (parseInt(_Zasspoje[tripNumber][pastNormalTime].departureTime) > parseInt(_.departureTime)) {
					if (parseInt(_Zasspoje[tripNumber][pastNormalTime].departureTime) >= 2400)
						_Zasspoje[tripNumber][i].departureTime = `${parseInt(_.departureTime) + (Math.floor(parseInt(_Zasspoje[tripNumber][pastNormalTime].departureTime) / 2400) * 2400)}`
					else
						_Zasspoje[tripNumber][i].departureTime = `${parseInt(_.departureTime) + 2400}`
					if (_.arrivalTime.length > 0) {
						_Zasspoje[tripNumber][i].arrivalTime = `${parseInt(_.arrivalTime) + ((parseInt(_Zasspoje[tripNumber][i].departureTime) / 2400) * 2400)}`
					}
				}

				if (parseInt(_Zasspoje[tripNumber][pastNormalTime].departureTime) > parseInt(_.arrivalTime)) {
					if (parseInt(_Zasspoje[tripNumber][pastNormalTime].arrivalTime) >= 2400)
						_Zasspoje[tripNumber][i].arrivalTime = `${parseInt(_.arrivalTime) + (Math.floor(parseInt(_Zasspoje[tripNumber][pastNormalTime].departureTime) / 2400) * 2400)}`
					else
						_Zasspoje[tripNumber][i].arrivalTime = `${parseInt(_.arrivalTime) + 2400}`
				}

				pastNormalTime = i
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
				stopSequence: i,
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