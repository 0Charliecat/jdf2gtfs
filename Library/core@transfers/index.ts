import { JDF2GTFS } from "../.."
import { getContentsArray } from "../_app/_reusables/getContentsArray"
import { Navaznosti, NavaznostiType, headers as navaznostiHeaders } from "../@isithere/jdf_types/Navaznosti"
import { CasKody, headers as caskodyHeaders } from "../@isithere/jdf_types/CasKody"
import { Zasspoje, headers as zasspojeHeaders } from "../@isithere/jdf_types/Zasspoje"

export class Transfer {
	fromStop?: string
	toStop?: string
	fromTrip?: string
	toTrip?: string
	transferType: number
	minTransferTime?: number

	constructor(init: {
		fromStop?: string
		toStop?: string
		fromTrip?: string
		toTrip?: string
		transferType: number
		minTransferTime?: number
	}) {
		this.fromStop = init.fromStop
		this.toStop = init.toStop
		this.fromTrip = init.fromTrip
		this.toTrip = init.toTrip
		this.transferType = init.transferType
		this.minTransferTime = init.minTransferTime
	}

	toJSON() {
		return {
			from_stop_id: this.fromStop ?? "",
			to_stop_id: this.toStop ?? "",
			from_trip_id: this.fromTrip ?? "",
			to_trip_id: this.toTrip ?? "",
			transfer_type: this.transferType,
			min_transfer_time: this.minTransferTime ?? ""
		}
	}

	toString() {
		return `${this.fromTrip ?? this.fromStop}_${this.toTrip ?? this.toStop}`
	}
}

// Matches: "pokračuje ako linka 275 do zastávky Závod, Cintorín"
// Also handles Czech diacritics (pokracuje) and variations without "ako"
const POKRACUJE_RE = /pokra[čc]uje(?:\s+ako)?\s+linka\s+(\d+)\s+do\s+zast[áa]vky\s+(.+)/i

/** Convert a HHMM string (e.g. "2359", "2401") to minutes since midnight. */
function hhmm2min(hhmm: string): number {
	const v = parseInt(hhmm)
	if (isNaN(v)) return NaN
	return Math.floor(v / 100) * 60 + (v % 100)
}

export default async function runtime(config: JDF2GTFS) {
	const { id_prefix } = config

	const _Navaznosti: Navaznosti[] = config.hasFile("navaznosti")
		? await getContentsArray(config.getFile("navaznosti")!, navaznostiHeaders)
		: []

	const _CasKody: CasKody[] = config.hasFile("caskody")
		? await getContentsArray(config.getFile("caskody")!, caskodyHeaders)
		: []

	const _Zasspoje: Zasspoje[] = config.hasFile("zasspoje")
		? await getContentsArray(config.getFile("zasspoje")!, zasspojeHeaders)
		: []

	// Group Zasspoje by trip for lookup
	const zByTrip = new Map<string, Zasspoje[]>()
	for (const z of _Zasspoje) {
		const key = `${z.lineNumber}_${z.lineResolution}_${z.tripNumber}`
		if (!zByTrip.has(key)) zByTrip.set(key, [])
		zByTrip.get(key)!.push(z)
	}

	const Entities: Map<string, Transfer> = new Map()

	// --- Navaznosti: guaranteed timed / minimum-time transfers ---
	for (const nav of _Navaznosti) {
		if (nav.type !== NavaznostiType.isWaitingFor) continue

		const waitingTripKey = `${nav.lineNumber}_${nav.lineResolution}_${nav.tripNumber}`
		const waitingTripId = `${id_prefix}${nav.lineNumber}r${nav.lineResolution}_${nav.tripNumber}`
		const waitingTripStops = zByTrip.get(waitingTripKey)

		// Find the row in the waiting trip where the connection happens
		const connectionZ = nav.stopIdContinued
			? waitingTripStops?.find(z => z.stopId === nav.stopIdContinued)
			: undefined

		const fromStop = nav.stopIdContinued ? `${id_prefix}${nav.stopIdContinued}` : undefined

		let connectingTripId: string | undefined
		let transferType = 2

		// Try to resolve the exact connecting trip by arrival time at the transfer stop
		if (nav.lineNumberContinued && connectionZ) {
			const deptMin = hhmm2min(connectionZ.departureTime || connectionZ.arrivalTime)
			const waitMins = parseInt(nav.timeWaited) || 5
			const linePrefix = `${nav.lineNumberContinued}_`

			for (const [tKey, tStops] of zByTrip) {
				if (!tKey.startsWith(linePrefix)) continue
				const arrZ = tStops.find(z => z.stopId === nav.stopIdContinued)
				if (!arrZ) continue

				const arrMin = hhmm2min(arrZ.arrivalTime || arrZ.departureTime)
				if (isNaN(deptMin) || isNaN(arrMin)) continue
				// Connecting trip must arrive within the wait window before the waiting trip departs
				if (arrMin <= deptMin && arrMin >= deptMin - waitMins) {
					connectingTripId = `${id_prefix}${tStops[0].lineNumber}r${tStops[0].lineResolution}_${tStops[0].tripNumber}`
					transferType = 1  // guaranteed timed transfer since we matched the trip
					break
				}
			}
		}

		const minTransferTime = transferType === 2 ? (parseInt(nav.timeWaited) || 0) * 60 : undefined

		const transfer = new Transfer({
			fromStop,
			toStop: fromStop,
			fromTrip: connectingTripId,
			toTrip: waitingTripId,
			transferType,
			minTransferTime
		})

		Entities.set(transfer.toString(), transfer)
	}

	// --- CasKody: in-seat transfers via block_id ---
	if (config.featureFlags.generateInSeatTransfersFromCaskody) {
		for (const caskod of _CasKody) {
			const noteStr = String(caskod.note ?? "")
			const match = POKRACUJE_RE.exec(noteStr)
			if (!match) continue

			// Normalize line number to 6-digit zero-padded form used across JDF
			const continuedLineNumber = match[1].padStart(6, "0")

			const fromTripKey = `${caskod.lineNumber}_${caskod.lineResolution}_${caskod.tripNumber}`
			const fromTripStops = zByTrip.get(fromTripKey)
			if (!fromTripStops?.length) continue

			const lastZ = fromTripStops[fromTripStops.length - 1]
			const lastStopId = lastZ.stopId
			const lastMin = hhmm2min(lastZ.departureTime || lastZ.arrivalTime)
			const linePrefix = `${continuedLineNumber}_`

			let matchedFirstStop: Zasspoje | undefined
			for (const [tKey, tStops] of zByTrip) {
				if (!tKey.startsWith(linePrefix)) continue
				// Continuation trip must start at the same stop
				if (tStops[0].stopId !== lastStopId) continue

				const firstMin = hhmm2min(tStops[0].departureTime || tStops[0].arrivalTime)
				if (isNaN(lastMin) || isNaN(firstMin)) continue
				// Allow up to 2-minute gap
				if (Math.abs(firstMin - lastMin) <= 2) {
					matchedFirstStop = tStops[0]
					break
				}
			}

			if (!matchedFirstStop) continue

			const fromTripId = `${id_prefix}${caskod.lineNumber}r${caskod.lineResolution}_${caskod.tripNumber}`
			const toTripId = `${id_prefix}${matchedFirstStop.lineNumber}r${matchedFirstStop.lineResolution}_${matchedFirstStop.tripNumber}`

			// Grow the block chain: if either trip is already in a block, reuse that id
			const existingBlock = config.blockIds.get(fromTripId) ?? config.blockIds.get(toTripId)
			const blockId = existingBlock ?? `${id_prefix}B_${fromTripId}`
			config.blockIds.set(fromTripId, blockId)
			config.blockIds.set(toTripId, blockId)

			const connectStop = `${id_prefix}${lastStopId}`
			const inSeat = new Transfer({
				fromStop: connectStop,
				toStop: connectStop,
				fromTrip: fromTripId,
				toTrip: toTripId,
				transferType: 4
			})
			Entities.set(inSeat.toString(), inSeat)
		}
	}

	return Entities
}
