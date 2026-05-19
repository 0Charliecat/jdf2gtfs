import { Agency, Calendar, FeedInfo, GTFSFeedInfoObject, RouteVehicleType, RouteVehicleTypeExtended, Stop } from "@isithere/gtfs"
import { HexCodeColor, LanguageCode, LongitudeLatitude, Timezone, Year } from "./Library/_app/_types/Simples"
import { JDFFileName, JDFFileProvider } from "./Library/lib@FileProvider/_types/FileProviderTypes";
import FileProvider from "./Library/lib@FileProvider/FileProvider";
import { RequestGTFSEntityChanges } from "./Library/_app/_types/RequestEntityChanges";
import { CustomPlatform } from "./Library/_app/_types/CustomPlatform";
import { SetupPevnyKod } from "./Library/core@pevnykod";
import { GTFSEntities } from "./Library/_app/_types/GTFSEntities";
import { Configuration, GeneratorOverrides, GeneratorOverridesMap } from "./Library/_app/_types/ConverterConfiguration";
import { FeatureFlags } from "./Library/_app/_types/FeatureFlags";

export class JDF2GTFS {

	fileProvider: JDFFileProvider
	id_prefix: string;
	platforms: CustomPlatform[];
	locations: Map<string, LongitudeLatitude>;
	requestEntityChanges: RequestGTFSEntityChanges;
	lineColors: Map<string, {background: HexCodeColor; foreground: HexCodeColor}>;
	feed_info: GTFSFeedInfoObject;
	
	stop_ids: Map<string, string>;
	stop_codes: Map<string, string>;
	timezone: Timezone;

	parentStops: string[]
	stopNames: Map<string, string>
	blockIds: Map<string, string>

	overrides: GeneratorOverridesMap

	featureFlags: FeatureFlags

	_loadedFiles: Map<JDFFileName, Uint8Array>
	_entities: Map<GTFSEntities, Map<string, any>>

	constructor(config: Configuration) {
		let e = config

		this.fileProvider = e.fileProvider!
		this.requestEntityChanges = Object.assign(
			{
				Stops: returnFalse,			// (value /*{ gtfs, jdf, platform }*/) => false,
				Agencies: returnFalse,		// ({ gtfs, jdf }) => false,
				Routes: returnFalse,		// ({ gtfs, jdf }) => false,
				Trips: returnFalse,			// ({ gtfs, jdf }) => false,
				StopTimes: returnFalse,		// ({ gtfs, jdf }) => false,
				Calendars: returnFalse,		// ({ gtfs, jdf }) => false,
				CalendarDates: returnFalse,	// ({ gtfs, jdf }) => false
			},
			e.requestEntityChanges ?? {}
		)
		this.stop_ids = new Map(Object.entries(e.stop_ids ?? {}))
		this.id_prefix = e.id_prefix ?? ""
		this.locations = new Map(Object.entries(e.locations ?? {}))
		this.platforms = [ ...(e.platforms ?? []) ]
		this.timezone = e.timezone || "Europe/Bratislava"
		this.stop_codes = new Map(Object.entries(e.stop_codes ?? {}))

		this.lineColors = new Map(Object.entries(Object.assign(
			{ default: { background: "ffffff", foreground: "000000" } }, 
			e.lineColors ?? {}
		)))

		this.overrides = {
			Route: {
				ShortName: new Map(Object.entries(e.overrides?.Route?.ShortName ?? {})),
				Type: new Map(Object.entries(e.overrides?.Route?.Type ?? {}))
			}
		}

		this.featureFlags = Object.assign(
			{
				useExtendedRouteTypes: false,
				ignoreCisloSpojeForDirection: false,
				useVerzeJDFIDAsFeedVersion: false,
				useTTValitityAsFeedValidity: false,
				generateInSeatTransfersFromCaskody: false,
				useParentStopNameForPlatforms: false,
				showCISCPCodeInStopCode: false
			}, 
			e.featureFlags ?? {}
		)
        // this.line_number_changes = Object.assign({}, e.line_number_changes)
        // this.line_colors = Object.assign({}, e.line_colors)
        // this.line_network = Object.assign({}, e.line_network);
        // this.stops = []
        // this.stop_times_headsigns = Object.assign({}, e.stop_times_headsigns)
        // this.feed_publisher_name = e.feed_publisher_name
        // this.feed_publisher_url = e.feed_publisher_url
        // this.start_date = e.start_date
        // this.end_date = e.end_date
        // this.feed_contact_email = e.feed_contact_email || ""
        // this.feed_contact_url = e.feed_contact_url || ""

		this.feed_info = e.feed_info ? 
			Object.assign(
				{

					feed_publisher_name: "", feed_puiblisher_url: "", feed_lang: "",
					feed_start_date: "", feed_end_date: "", feed_contact_email: "",
					feed_contact_url: "", feed_version: ""
				},
				e.feed_info
			) : 
			{

				feed_publisher_name: "A generator instance of jdf2gtfs",
				feed_puiblisher_url: "https://github.com/0Charliecat/jdf2gtfs",
				feed_lang: "sk",
				feed_start_date: "",
				feed_end_date: "",
				feed_contact_email: "",
				feed_contact_url: ""
			}

		this._loadedFiles = new Map()
		this._entities = new Map()
		this.parentStops = config.parentStops ?? []
		this.stopNames = new Map()
		this.blockIds = new Map()
    }

	async loadFiles() {
		const loaded = await FileProvider.readZipBuffer(this.fileProvider.contents)
		this._loadedFiles = new Map(Object.entries(loaded) as [JDFFileName, Uint8Array][])
		SetupPevnyKod(this)
	}

	getFile(file: JDFFileName) {
		return this._loadedFiles.get(file)
	}

	hasFile(file: JDFFileName) {
		return this._loadedFiles.has(file)
	}

	getStop(id: string) {
		return this._entities.get("stops")!.get(id) as (Stop | null)
	}

	async makeAgencies() {
		const Agencies = await import("./Library/core@agencies/index")
		let generated = await Agencies.default(this)
		this._entities.set("agency", generated)
		return generated
	}

	async makeStops() {
		const Stops = await import("./Library/core@stops/index")
		let generated = await Stops.default(this)
		this._entities.set("stops", generated)
		return generated
	}

	async makeTrips() {
		const Trips = await import("./Library/core@trips/index")
		let generated = await Trips.default(this)
		this._entities.set("trips", generated!)
		return generated
	}

	async makeRoutes() {
		const Routes = await import("./Library/core@routes/index")
		let generated = await Routes.default(this)
		this._entities.set("routes", generated)
		return generated
	}

	async makeStopTimes() {
		const StopTimes = await import("./Library/core@stop_times/index")
		let generated = await StopTimes.default(this)
		this._entities.set("stop_times", generated)
		return generated
	}

	async makeCalendars() {
		const Calendar = await import("./Library/core@calendar/index")
		let generated = await Calendar.default(this)
		this._entities.set("calendar", generated)
		return generated
	}

	async makeCalendarDates() {
		const CalendarDates = await import("./Library/core@calendar_dates/index")
		let generated = await CalendarDates.default(this)
		this._entities.set("calendar_dates", generated)
		return generated
	}

	// async makeTransfers() {
	// 	const Transfers = await import("./Library/core@transfers/index")
	// 	let generated = await Transfers.default(this)
	// 	this._entities.set("transfers", generated)
	// 	return generated
	// }

	async makeFeedInfo() {
		const FeedInfo = await import("./Library/core@feed_info/index")
		let generated = await FeedInfo.default(this)
		this._entities.set("feed_info", new Map([["0", generated]]))
		return [ generated ]
	}

	async makeAll() {
		await this.loadFiles()
		await this.makeAgencies()
		await this.makeStops()
		await this.makeRoutes()
		// await this.makeTransfers()  // must run before makeTrips to populate blockIds
		await this.makeTrips()
		await this.makeStopTimes()
		await this.makeCalendars()
		await this.makeCalendarDates()
		await this.makeFeedInfo()

		return await this.zipEntities()
	}

	async zipEntities() {
		return await FileProvider.createZip(this._entities)
	}
	
	async softDestroyCalendar(id: string) {
		let oldCalendar = this._entities.get("calendar")!.get(id)
		if (!oldCalendar) return;
		this._entities.get("calendar")!.set(id, new Calendar({
			id: id,
			monday: false,
			tuesday: false,
			wednesday: false,
			thursday: false,
			friday: false,
			saturday: false,
			sunday: false,
			start: oldCalendar.start,
			end: oldCalendar.end
		}))
	}

    // async make() {
    //     let stops = await Stops(this);
    //     this.stops = stops
    //     let agencies = await Agencies(this)
    //     let routes = await Routes(this)
    //     let trips = await Trips(this)
    //     let stoptimes = await StopTimes(this)
    //     let calendar = await Calendar(this)
    //     let calendardates = await CalendarDates(this)
    //     let feedinfo = await FeedInfo(this)

    //     calendardates = removeDuplicatesCalDates(calendardates)

    //     let StopsCSV = await converter.json2csv(stops);
    //     let AgencyCSV = await converter.json2csv(agencies);
    //     let RoutesCSV = await converter.json2csv(routes);
    //     let TripsCSV = await converter.json2csv(trips);
    //     let StopTimesCSV = await converter.json2csv(stoptimes)
    //     let CalendarCSV = await converter.json2csv(calendar)
    //     let CalendarDatesCSV = await converter.json2csv(calendardates)
    //     let FeedInfoCSV = await converter.json2csv(feedinfo)

    //     fs.writeFileSync(path.join(this.output, "stops.txt"), StopsCSV)
    //     fs.writeFileSync(path.join(this.output, "agency.txt"), AgencyCSV)
    //     fs.writeFileSync(path.join(this.output, "routes.txt"), RoutesCSV)
    //     fs.writeFileSync(path.join(this.output, "trips.txt"), TripsCSV)
    //     fs.writeFileSync(path.join(this.output, "stop_times.txt"), StopTimesCSV)
    //     fs.writeFileSync(path.join(this.output, "calendar.txt"), CalendarCSV)
    //     fs.writeFileSync(path.join(this.output, "calendar_dates.txt"), CalendarDatesCSV)
    //     fs.writeFileSync(path.join(this.output, "feed_info.txt"), FeedInfoCSV)
    // }

}

function returnFalse(value: any) {
	return false
}

// exports = module.exports = JDF2GTFS

// exports.Stops = Stops
// exports.Agencies = Agencies
// exports.Routes = Routes
// exports.Trips = Trips
// exports.StopTimes = StopTimes
// exports.Calendar = Calendar
// exports.CalendarDates = CalendarDates
// exports.FeedInfo = FeedInfo
// exports.classes = classes
// exports.enums = jdfEnum