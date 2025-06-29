export interface FeatureFlags {

	/**
	 * If true, the converter will use the `RouteVehicleTypeExtended` enum instead of the `RouteVehicleType` enum when generating routes.
	 * This allows for more specific vehicle types to be used in the GTFS file.
	 * 
	 * @default false
	 * @see Library/core@routes/index.ts:29
	 */
	useExtendedRouteTypes: boolean;

	/**
	 * If true, the converter will ignore the `<Spoje>.tripNumber` field when determining the direction of a trip.
	 * This can be useful when the trip number is not indicative of the direction of the trip.
	 * 
	 * @default false
	 * @see Library/core@trips/index.ts:38
	 */
	ignoreCisloSpojeForDirection: boolean;

	/**
	 * If true, the converter will use the `feed_id` or `feed_production_date` field (JDF) as the `feed_version` field in the GTFS file.
	 * 
	 * @default false
	 * @see Library/core@routes/index.ts:29
	 */
	useVerzeJDFIDAsFeedVersion: boolean;

	/**
	 * If true, the converter will use the validity fields (JDF) as the `feed_start` & `feed_end` fields in the GTFS file.
	 * 
	 * @default false
	 * @see Library/core@feed_info/index.ts:35
	 */
	useTTValitityAsFeedValidity: boolean;

	/**
	 * If true, the converter will use Caskod note as a basis of `transfer_type=4`. And sets the same `block_id` for all grouped trips.
	 * 
	 * @default false
	 * @see Library/core@routes/index.ts:29
	 */
	generateInSeatTransfersFromCaskody: boolean;
}