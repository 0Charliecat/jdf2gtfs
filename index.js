const Stops = require("./lib/stops")
const Agencies = require("./lib/agencies")
const Routes = require("./lib/routes")
const Trips = require("./lib/trips")
const StopTimes = require("./lib/stop_times")
const Calendar = require("./lib/calendar")
const CalendarDates = require('./lib/calendar_dates')
const FeedInfo = require("./lib/feed_info")
const jdfEnum = require("./lib/jdfenum")
const converter = require('json-2-csv');
const fs = require("fs")
const path = require("path")
const removeDuplicatesCalDates = (arr) => [...new Map(arr.map(obj => [`${obj.service_id},${obj.date}`, obj])).values()];

class JDF2GTFS {
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

        this.path = e.path
        this.output = e.output || path.join(this.path, "gfts")
        this.stop_ids = Object.assign({}, e.stop_ids)
        this.id_prefix = e.id_prefix || ""
        this.locations = Object.assign({}, e.locations)
        this.platforms = [].concat(e.platforms)
        this.timezone = e.timezone || "Europe/Bratislava"
        this.lang = e.lang || "sk"
        this.line_number_changes = Object.assign({}, e.line_number_changes)
        this.line_colors = Object.assign({}, e.line_colors)
        this.line_network = Object.assign({}, e.line_network);
        this.stops = []
        this.stop_times_headsigns = Object.assign({}, e.stop_times_headsigns)
        this.years = Array.from(new Set([now.getUTCFullYear()].concat(e.years)))
        this.line_route_type_override = Object.assign({}, e.line_route_type_override)
    }

    async make() {
        let stops = await Stops(this);
        this.stops = stops
        let agencies = await Agencies(this)
        let routes = await Routes(this)
        let trips = await Trips(this)
        let stoptimes = await StopTimes(this)
        let calendar = await Calendar(this)
        let calendardates = await CalendarDates(this)
        let feedinfo = await FeedInfo(this)

        calendardates = removeDuplicatesCalDates(calendardates)

        let StopsCSV = await converter.json2csv(stops);
        let AgencyCSV = await converter.json2csv(agencies);
        let RoutesCSV = await converter.json2csv(routes);
        let TripsCSV = await converter.json2csv(trips);
        let StopTimesCSV = await converter.json2csv(stoptimes)
        let CalendarCSV = await converter.json2csv(calendar)
        let CalendarDatesCSV = await converter.json2csv(calendardates)
        let FeedInfoCSV = await converter.json2csv(feedinfo)

        fs.writeFileSync(path.join(this.output, "stops.txt"), StopsCSV)
        fs.writeFileSync(path.join(this.output, "agency.txt"), AgencyCSV)
        fs.writeFileSync(path.join(this.output, "routes.txt"), RoutesCSV)
        fs.writeFileSync(path.join(this.output, "trips.txt"), TripsCSV)
        fs.writeFileSync(path.join(this.output, "stop_times.txt"), StopTimesCSV)
        fs.writeFileSync(path.join(this.output, "calendar.txt"), CalendarCSV)
        fs.writeFileSync(path.join(this.output, "calendar_dates.txt"), CalendarDatesCSV)
        fs.writeFileSync(path.join(this.output, "feed_info.txt"), FeedInfoCSV)
    }

}

exports = module.exports = JDF2GTFS

exports.Stops = Stops
exports.Agencies = Agencies
exports.Routes = Routes
exports.Trips = Trips
exports.StopTimes = StopTimes
exports.Calendar = Calendar
exports.CalendarDates = CalendarDates
exports.FeedInfo = FeedInfo
exports.classes = classes
exports.enums = jdfEnum