import { Agency } from "./Agency";

export class Route {
    /*
    
	Field Name			Type										Presence					Description
	route_id			Unique ID									Required					Identifies a route.
	agency_id			Foreign ID referencing agency.agency_id		Conditionally Required		Agency for the specified route.

																								Conditionally Required:
																								- Required if multiple agencies are defined in agency.txt.
																								- Recommended otherwise.
	route_short_name	Text										Conditionally Required		Short name of a route. Often a short, abstract identifier (e.g., "32", "100X", "Green") that riders use to identify a route. Both route_short_name and route_long_name may be defined.

																								Conditionally Required:
																								- Required if routes.route_long_name is empty.
																								- Recommended if there is a brief service designation. This should be the commonly-known passenger name of the service, and should be no longer than 12 characters.
	route_long_name		Text										Conditionally Required		Full name of a route. This name is generally more descriptive than the route_short_name and often includes the route's destination or stop. Both route_short_name and route_long_name may be defined.

																								Conditionally Required:
																								- Required if routes.route_short_name is empty.
																								- Optional otherwise.
	route_desc			Text										Optional					Description of a route that provides useful, quality information. Should not be a duplicate of route_short_name or route_long_name.
																								Example: "A" trains operate between Inwood-207 St, Manhattan and Far Rockaway-Mott Avenue, Queens at all times. Also from about 6AM until about midnight, additional "A" trains operate between Inwood-207 St and Lefferts Boulevard (trains typically alternate between Lefferts Blvd and Far Rockaway).
	route_type			Enum										Required					Indicates the type of transportation used on a route. Valid options are:

																								0 - Tram, Streetcar, Light rail. Any light rail or street level system within a metropolitan area.
																								1 - Subway, Metro. Any underground rail system within a metropolitan area.
																								2 - Rail. Used for intercity or long-distance travel.
																								3 - Bus. Used for short- and long-distance bus routes.
																								4 - Ferry. Used for short- and long-distance boat service.
																								5 - Cable tram. Used for street-level rail cars where the cable runs beneath the vehicle (e.g., cable car in San Francisco).
																								6 - Aerial lift, suspended cable car (e.g., gondola lift, aerial tramway). Cable transport where cabins, cars, gondolas or open chairs are suspended by means of one or more cables.
																								7 - Funicular. Any rail system designed for steep inclines.
																								11 - Trolleybus. Electric buses that draw power from overhead wires using poles.
																								12 - Monorail. Railway in which the track consists of a single rail or a beam.
	route_url			URL											Optional					URL of a web page about the particular route. Should be different from the agency.agency_url value.
	route_color			Color										Optional					Route color designation that matches public facing material. Defaults to white (FFFFFF) when omitted or left empty. The color difference between route_color and route_text_color should provide sufficient contrast when viewed on a black and white screen.
	route_text_color	Color										Optional					Legible color to use for text drawn against a background of route_color. Defaults to black (000000) when omitted or left empty. The color difference between route_color and route_text_color should provide sufficient contrast when viewed on a black and white screen.
	route_sort_order	Non-negative integer						Optional					Orders the routes in a way which is ideal for presentation to customers. Routes with smaller route_sort_order values should be displayed first.
	continuous_pickup	Enum										Conditionally Forbidden		Indicates that the rider can board the transit vehicle at any point along the vehicle’s travel path as described by shapes.txt, on every trip of the route. Valid options are:

																								0 - Continuous stopping pickup.
																								1 or empty - No continuous stopping pickup.
																								2 - Must phone agency to arrange continuous stopping pickup.
																								3 - Must coordinate with driver to arrange continuous stopping pickup.
																								
																								Values for routes.continuous_pickup may be overridden by defining values in stop_times.continuous_pickup for specific stop_times along the route.
																								
																								Conditionally Forbidden:
																								- Forbidden if stop_times.start_pickup_drop_off_window or stop_times.end_pickup_drop_off_window are defined for any trip of this route.
																								- Optional otherwise.
	continuous_drop_off	Enum										Conditionally Forbidden		Indicates that the rider can alight from the transit vehicle at any point along the vehicle’s travel path as described by shapes.txt, on every trip of the route. Valid options are:
																								
																								0 - Continuous stopping drop off.
																								1 or empty - No continuous stopping drop off.
																								2 - Must phone agency to arrange continuous stopping drop off.
																								3 - Must coordinate with driver to arrange continuous stopping drop off.
																								
																								Values for routes.continuous_drop_off may be overridden by defining values in stop_times.continuous_drop_off for specific stop_times along the route.
																								
																								Conditionally Forbidden:
																								- Forbidden if stop_times.start_pickup_drop_off_window or stop_times.end_pickup_drop_off_window are defined for any trip of this route.
																								- Optional otherwise.
	network_id			ID											Conditionally Forbidden		Identifies a group of routes. Multiple rows in routes.txt may have the same network_id.
																								
																								Conditionally Forbidden:
																								- Forbidden if the route_networks.txt file exists.
																								- Optional otherwise.

    */

	id: string;
	agency: Agency | string;
	shortName?: string;
	lostName?: string;
	description?: string;
	type: RouteVehicleType;
	url?: 		string | URL;
	backgoundColor?: string;
	foregroundColor?: string;
	sortOrder?: Number;
	continousPickUp?: RouteContinuous;
	continuousDropOff?: RouteContinuous
	networkID?: string;

	constructor(init: 
		{ id: string; agency: Agency | string; shortName?: string; lostName?: string; description?: string; type: RouteVehicleType; url?: string | URL; backgoundColor?: string; foregroundColor?: string; sortOrder?: number; continousPickUp?: RouteContinuous; continuousDropOff?: RouteContinuous; networkID?: string; } |
		GTFSRouteObject | any
	) {
        if (init.hasOwnProperty('id')) {
			this.id = init.id;
			this.agency = init.agency;
			this.shortName = init.shortName;
			this.lostName = init.lostName;
			this.description = init.description;
			this.type = init.type;
			this.url = init.url;
			this.backgoundColor = init.backgoundColor;
			this.foregroundColor = init.foregroundColor;
			this.sortOrder = init.sortOrder;
			this.continousPickUp = init.continousPickUp;
			this.continuousDropOff = init.continuousDropOff;
			this.networkID = init.networkID;
		} else {
			this.id = init.route_id;
			this.agency = init.agency_id;
			this.shortName = init.route_short_name;
			this.lostName = init.route_long_name;
			this.description = init.route_desc;
			this.type = init.route_type;
			this.url = init.route_url;
			this.backgoundColor = init.route_color;
			this.foregroundColor = init.route_text_color;
			this.sortOrder = init.route_sort_order;
			this.continousPickUp = init.continuous_pickup;
			this.continuousDropOff = init.continuous_drop_off;
			this.networkID = init.network_id;
		}
    }

	public toJSON() {
		return {
			route_id: this.id,
			agency_id: this.agency,
			route_short_name: this.shortName,
			route_long_name: this.lostName,
			route_desc: this.description,
			route_type: this.type,
			route_url: this.url,
			route_color: this.backgoundColor,
			route_text_color: this.foregroundColor,
			route_sort_order: this.sortOrder,
			continuous_pickup: this.continousPickUp,
			continuous_drop_off: this.continuousDropOff,
			network_id: this.networkID,
		}
	}

	public toString() {
        return this.id;
    }
}

export enum RouteVehicleType {
	Tram = 0,
	Streetcar = 0,
	LightRail = 0,
	Subway = 1,
	Metro = 1,
	Rail = 2,
	Bus = 3,
	Ferry = 4,
	CableCar = 5,
	ArealLift = 6,
	Funicular = 7,
	Trolleybus = 11,
	Monorail = 12
}

export enum RouteContinuous {
	Continuous = 0,
	NoContinuous = 1,
	PhoneAgency = 2,
	DriverArrangement = 3
}

export interface GTFSRouteObject {
	route_id: string;
	agency_id: string;
	route_short_name: string;
	route_long_name: string;
	route_desc: string;
	route_type: RouteVehicleType;
	route_url: string;
	route_color: string;
	route_text_color: string;
	route_sort_order: number;
	continuous_pickup: RouteContinuous;
	continuous_drop_off: RouteContinuous;
	network_id: string;
}