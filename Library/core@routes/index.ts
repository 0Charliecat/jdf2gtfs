import { JDF2GTFS } from "../.."
import { getContentsArray } from "../_app/_reusables/getContentsArray";
import { Route, RouteVehicleType, RouteVehicleTypeExtended } from '@isithere/gtfs'
import { BooleanyValue } from "../_app/_types/BooleanyValue";
import { DopravnyProstriedok, Linky, TypLinky, headers } from "../@isithere/jdf_types/Linky";
import { LinExt, headers as linextHeaders } from "../@isithere/jdf_types/LinExt";
import { getAgencyID } from "../core@agencies";
import { Udaje, headers as udajeHeaders } from "../@isithere/jdf_types/Udaje";

export default async function runtime(config: JDF2GTFS) {
	const { id_prefix, lineColors } = config
	const _Linky: Linky[] = await getContentsArray(
		config.getFile("linky")!,
		headers
	)
	const _LinExt: LinExt[] = config.getFile("linext") 
		? await getContentsArray(config.getFile("linext")!, linextHeaders)
		: []
	
	const _Udaje: Udaje[] = config.getFile("udaje")
		? await getContentsArray(config.getFile("udaje")!, udajeHeaders)
		: []

	let Entities: Map<string, Route> = new Map()

	for (let _ of _Linky) {
		let _ext = _LinExt.find(ext => ext.lineNumber == _.number) ?? null
		let computedRoute = new Route({
			id: `${id_prefix}${_.number}r${_.lineResolution}`,
			agency: getAgencyID(id_prefix, _.agencyID, _.agencyResolution),
			shortName: (config.overrides.Route.ShortName.get(_.number)) ?? (Boolean(_ext?.preference) ? _ext?.routeShortName : _.number),
			longName: _.name,
			type: 
				config.overrides.Route.Type.get(_.number) ?? 
				(config.featureFlags.useExtendedRouteTypes ? _GetGTFSRouteTypeFromLinExt(_.routingType, _.vehicleType) : _GetGTFSRouteType(_.vehicleType)),
			backgroundColor: lineColors.get(_.number)?.background ?? lineColors.get("default")?.background,
			foregroundColor: lineColors.get(_.number)?.foreground ?? lineColors.get("default")?.foreground,
			description:
				_Udaje
					.filter(udaje => udaje.lineNumber === _.number)
					.sort((a, b) => Number(a.rowNumber) - Number(b.rowNumber))
					.map(udaje => `[${udaje.rowNumber}] ${udaje.text}`)
					.join(" --- ")
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

function _GetGTFSRouteTypeFromLinExt(routingType: TypLinky, vehicleType: DopravnyProstriedok) {
	if (vehicleType === DopravnyProstriedok.Trolleybus)
		return RouteVehicleTypeExtended.TrolleybusService
	else if (vehicleType === DopravnyProstriedok.Tram)
		return RouteVehicleTypeExtended.TramService
	else if (vehicleType === DopravnyProstriedok.Metro)
		return RouteVehicleTypeExtended.Underground
	else if (vehicleType === DopravnyProstriedok.CableCar)
		return RouteVehicleTypeExtended.FunicularServices
	else if (vehicleType === DopravnyProstriedok.Ferry)
		return RouteVehicleTypeExtended.WaterTransportService
	else if (vehicleType === DopravnyProstriedok.Bus) {
		switch (routingType) {
			case TypLinky.Urban:
				return RouteVehicleTypeExtended.BusService
			case TypLinky.UrbanWithSuburbanService:
				return RouteVehicleTypeExtended.RegionalBus
			case TypLinky.NationalWithinRegion:
				return RouteVehicleTypeExtended.RegionalBus
			case TypLinky.NationalBetweenRegions:
				return RouteVehicleTypeExtended.RegionalCoach
			case TypLinky.NationalLongDistance:
				return RouteVehicleTypeExtended.NationalCoach
			case TypLinky.InternationalWithoutNationalService:
				return RouteVehicleTypeExtended.InternationalCoach
			case TypLinky.InternationalWithNationalService:
				return RouteVehicleTypeExtended.InternationalCoach
		}
	}
		
}