import { Agency, FeedInfo, GTFSFeedInfoObject, RouteVehicleType, RouteVehicleTypeExtended, Stop } from "@isithere/gtfs"
import { HexCodeColor, LanguageCode, LongitudeLatitude, Timezone, Year } from "./Library/_app/_types/Simples"
import { JDFFileName, JDFFileProvider } from "./Library/lib@FileProvider/_types/FileProviderTypes";
import FileProvider from "./Library/lib@FileProvider/FileProvider";
import { RequestGTFSEntityChanges } from "./Library/_app/_types/RequestEntityChanges";
import { CustomPlatform } from "./Library/_app/_types/CustomPlatform";
import { SetupPevnyKod } from "./Library/core@pevnykod";
import { GTFSEntities } from "./Library/_app/_types/GTFSEntities";

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
	lang: LanguageCode;

	lineNumberChanges: Map<string, string>;
	stops: Map<string, Stop>;

	overrides: {
		Route: {
			ShortName: Map<string, string>,
			Type: Map<string, RouteVehicleType | RouteVehicleTypeExtended>
		}
	}

	featureFlags: {
		useExtendedRouteTypes: boolean
	}

	private _loadedFiles: Map<JDFFileName|String, Buffer>
	private _entities: Map<GTFSEntities, Map<string, any>>

    constructor(e) {
        /*let config = {
            path: "/workspaces/jdf2gtfs/.temp/tdtrencin11102022",
            output: "/workspaces/jdf2gtfs/.temp/gtfs",
            stop_ids: {
                "5000501": "gensvobodu"
            },
            id_prefix: "TDTRENCIN:",
            locations: {},
            stop_codes: {},
            platforms: [{
                parent: "5000501",
                code: "A",
                location: [48.8748300, 18.0489801]
            }],
            timezone: "Europe/Bratislava",
            lang: "sk",
            line_number_changes: {},
            line_colors: {},
            line_network: {},
            stops: [],
            stop_times_headsigns: {},
            years: [2022],
            line_route_type_override: {}
        };*/
        let now = new Date()

        // this.output = e.output || path.join(this.path, "gfts")
		this.fileProvider = e.fileProvider
		this.requestEntityChanges = Object.assign(
			{
				Stops: ({ gtfs, jdf }) => false,
				Agencies: ({ gtfs, jdf }) => false,
				Routes: ({ gtfs, jdf }) => false,
				Trips: ({ gtfs, jdf }) => false,
				StopTimes: ({ gtfs, jdf }) => false,
				Calendars: ({ gtfs, jdf }) => false,
				CalendarDates: ({ gtfs, jdf }) => false
			},
			e.requestEntityChanges
		)
        this.stop_ids = new Map(Object.entries(e.stop_ids ?? {}))
        this.id_prefix = e.id_prefix || ""
        this.locations = new Map(Object.entries(e.locations ?? {}))
        this.platforms = [].concat(e.platforms)
        this.timezone = e.timezone || "Europe/Bratislava"
        this.lang = e.lang || "sk"
		this.stop_codes = new Map(Object.entries(e.stop_codes ?? {}))

		this.lineColors = new Map(Object.entries(Object.assign({ default: { background: "ffffff", foreground: "000000" }}, e.lineColors ?? {})))

		this.overrides = {
			Route: {
				ShortName: new Map(Object.entries(e.overrides?.Route?.ShortName ?? {})),
				Type: new Map(Object.entries(e.overrides?.Route?.Type ?? {}))
			}
		}

		this.featureFlags = Object.assign(
			{ useExtendedRouteTypes: false }, 
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

		this.feed_info = {
			feed_publisher_name: "IsItHere",
			feed_puiblisher_url: "https://isithere.sk",
			feed_lang: "sk",
			feed_start_date: "2024-12-15",
			feed_end_date: "2025-12-13",
			feed_contact_email: "ahoj@isithere.sk",
			feed_contact_url: "https://isithere.sk"
		}

		this._loadedFiles = new Map()
		this._entities = new Map()
    }

	async loadFiles() {
		switch (this.fileProvider.type) {
			case "zipbuffer":
				let loaded = await FileProvider.readZipBuffer(this.fileProvider.contents)
				this._loadedFiles = new Map(Object.entries(loaded))
				break;
			case "zipfile":
				let loaded2 = await FileProvider.readZipPath(this.fileProvider.path)
				this._loadedFiles = new Map(Object.entries(loaded2))
				break;
			case "folder":
				let loaded3 = await FileProvider.readFolder(this.fileProvider.path)
				this._loadedFiles = new Map(Object.entries(loaded3))
				break;
		}

		SetupPevnyKod(this)
	}

	getFile(file: JDFFileName) {
		return this._loadedFiles.get(file)
	}

	hasFile(file: JDFFileName) {
		return this._loadedFiles.has(file)
	}

	getStop(id: string) {
		return this._entities.get("stops")!.get(id) as Stop
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

	async makeFeedInfo() {
		const feed_info = new FeedInfo({
			publisherName: this.feed_info.feed_publisher_name,
			publisherUrl: this.feed_info.feed_puiblisher_url,
			lang: this.feed_info.feed_lang,
			start: new Date(this.feed_info.feed_start_date!),
			end: new Date(this.feed_info.feed_end_date!),
			version: this.feed_info.feed_version,
			contactEmail: this.feed_info.feed_contact_email,
			contactUrl: this.feed_info.feed_contact_url,
			// TODO: Finish this generator
		})

		this._entities.set("feed_info", new Map([["0", feed_info]]))
		return [ feed_info ]
	}

	async makeAll() {
		await this.loadFiles()
		await this.makeAgencies()
		await this.makeStops()
		await this.makeRoutes()
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