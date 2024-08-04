import path from "path";
import { JDF2GTFS } from "../.."
import { getContentsArray } from "../_app/_reusables/getContentsArray";
import { Route, RouteVehicleType } from '../@isithere/gtfs_types/Route'
import { BooleanyValue } from "../_app/_types/BooleanyValue";

// Defined JDF Headers from Docs
const JDFHeaders = [ "lineNumber", "lineName", "agencyID", "routingType", "vehicleType", "inDisrupted", "isRoutingGroup", "usingOfPlatforms", "isOneWayTimetable", "_01", "licenseNumber", "licenseValidFrom", "licenseValidUntil", "timetableValidFrom", "timetableValidUntil", ] 

export default async function runtime(config: JDF2GTFS) {
	const { id_prefix, lineColors } = config
	const _Linky: JDFLinkyObject[] = await getContentsArray(
		path.join(config.path, 'linky.txt'),
		JDFHeaders
	)

	let Entities: Map<string, Route> = new Map()

	for (let _ of _Linky) {
		let computedRoute = new Route({
			id: id_prefix+_.lineNumber,
			agency: id_prefix+_.agencyID,
			shortName: _.lineNumber,
			longName: _.lineName,
			type: _GetGTFSRouteType(_.vehicleType),
			backgroundColor: lineColors.get(_.lineNumber)?.background ?? "ffffff",
			foregroundColor: lineColors.get(_.lineNumber)?.background ?? "000000"
		})

		Entities.set(computedRoute.id, computedRoute)
	}

	return Entities

}

function _GetGTFSRouteType(type: JDFVehicleType) {
	switch (type) {
		case JDFVehicleType.Bus:
			return RouteVehicleType.Bus
		case JDFVehicleType.Ferry:
			return RouteVehicleType.Ferry
		case JDFVehicleType.Funicular:
			return RouteVehicleType.Funicular
		case JDFVehicleType.Tram:
			return RouteVehicleType.Streetcar
		case JDFVehicleType.Trolleybus:
			return RouteVehicleType.Trolleybus
		case JDFVehicleType.Underground:
			return RouteVehicleType.Metro
		
		default:
			return null
	}
}

enum JDFVehicleType {
	Bus = "A",
	Tram = "E",
	Funicular = "L",
	Underground = "M",
	Ferry = "P",
	Trolleybus = "T"
}

enum JDFRoutingType {
	City = "A",								// Městská
	'City+Suburban' = 'B',					// Městská s obsluhou příměstských oblastí
	InternationalNoInnerTransport = "N",	// Mezinárodní – s vyloučenou vnitrostátní dopravou
	InternationalInnerTransport = "P",		// Mezinárodní – s povolenou vnitrostátní dopravou
	Region = "V",							// Vnitrostátní – vnitrokrajská
	InterRegion = "Z",						// Vnitrostátní – mezikrajská
	LongDistance = "D"						// Vnitrostátní – dálková
}

interface JDFLinkyObject {
	lineNumber: string;
	lineName: string;
	agencyID: string;
	routingType: JDFRoutingType;
	vehicleType: JDFVehicleType;
	isDisrupted: BooleanyValue;
	isRoutingGroup: BooleanyValue;
	usingOfPlatforms: BooleanyValue;
	isOneWayTimetable: BooleanyValue;
	_01: any;
	licenseNumber?: string;
	licenseValidFrom?: string;		// Date in DDMMYYYY
	licenseValidUntil?: string;		// Date in DDMMYYYY
	timetableValidFrom: string;		// Date in DDMMYYYY
	timetableValidUntil: string;	// Date in DDMMYYYY
	extAgency: string;
	extLine: string;
}

