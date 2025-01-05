import path from "path";
import { JDF2GTFS } from "../.."
import { getContentsArray } from "../_app/_reusables/getContentsArray";
import { Route, RouteVehicleType } from '@isithere/gtfs'
import { BooleanyValue } from "../_app/_types/BooleanyValue";
import { DopravnyProstriedok, Linky, headers } from "../@isithere/jdf_types/Linky";
import { LinExt, headers as linextHeaders } from "../@isithere/jdf_types/LinExt";
import { getAgencyID } from "../core@agencies";

export default async function runtime(config: JDF2GTFS) {
	const { id_prefix, lineColors } = config
	const _Linky: Linky[] = await getContentsArray(
		config.getFile("linky")!,
		headers
	)
	const _LinExt: LinExt[] = config.getFile("linext") 
		? await getContentsArray(config.getFile("linext")!, linextHeaders)
		: []

	let Entities: Map<string, Route> = new Map()

	for (let _ of _Linky) {
		let _ext = _LinExt.find(ext => ext.lineNumber === _.number)
		console.log(_)
		let computedRoute = new Route({
			id: `${id_prefix}${_.number}r${_.lineResolution}`,
			agency: getAgencyID(id_prefix, _.agencyID, _.agencyResolution),
			shortName: _ext?.preference ? _ext!.routeShortName : _.number,
			longName: _.name,
			type: _GetGTFSRouteType(_.vehicleType),
			// backgroundColor: lineColors.get(_.number)?.background ?? "ffffff",
			// foregroundColor: lineColors.get(_.number)?.background ?? "000000"
		})

		Entities.set(computedRoute.id, computedRoute)
	}

	return Entities

}

function _GetGTFSRouteType(type: DopravnyProstriedok) {
	switch (type) {
		case DopravnyProstriedok.Bus:
			return RouteVehicleType.Bus
		case DopravnyProstriedok.Ferry:
			return RouteVehicleType.Ferry
		case DopravnyProstriedok.CableCar:
			return RouteVehicleType.Funicular
		case DopravnyProstriedok.Tram:
			return RouteVehicleType.Streetcar
		case DopravnyProstriedok.Trolleybus:
			return RouteVehicleType.Trolleybus
		case DopravnyProstriedok.Metro:
			return RouteVehicleType.Metro
		
		default:
			return null
	}
}