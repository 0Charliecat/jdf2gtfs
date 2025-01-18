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
		let _ext = _LinExt.find(ext => ext.lineNumber === _.number) ?? null
		let computedRoute = new Route({
			id: `${id_prefix}${_.number}r${_.lineResolution}`,
			agency: getAgencyID(id_prefix, _.agencyID, _.agencyResolution),
			shortName: (config.overrides.Route.ShortName.get(_.number)) ?? (_ext?.preference ? _ext.routeShortName : _.number),
			longName: _.name,
			type: config.overrides.Route.Type.get(_.number) ?? _GetGTFSRouteType(_.vehicleType),
			backgroundColor: lineColors.get(_.number)?.background ?? lineColors.get("default")?.background,
			foregroundColor: lineColors.get(_.number)?.foreground ?? lineColors.get("default")?.foreground
		})

		if ((computedRoute.longName ?? "").startsWith(computedRoute.shortName!))
			computedRoute.longName = computedRoute.longName?.replace(computedRoute.shortName!, "").trim()

		let requestEntityChanges = config.requestEntityChanges?.Routes({ gtfs: computedRoute, jdf: _ })
		if (requestEntityChanges)
			computedRoute = Object.assign(computedRoute, requestEntityChanges)

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