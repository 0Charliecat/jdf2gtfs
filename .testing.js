const Stops = require("./lib/stops")
const Agencies = require("./lib/agencies")
const Routes = require("./lib/routes")
const Trips = require("./lib/trips")
const StopTimes = require("./lib/stop_times")
const Calendar = require("./lib/calendar")
const CalendarDates = require('./lib/calendar_dates')
const FeedInfo = require("./lib/feed_info")
const csv=require("csvtojson");
const converter = require('json-2-csv');
const fs = require("fs")
const path = require("path")
const removeDuplicatesCalDates = (arr) => [...new Map(arr.map(obj => [`${obj.service_id},${obj.date}`, obj])).values()];

let config = {
    path: "/workspaces/jdf2gtfs/.temp/tdtrencin11102022",
    output: "/workspaces/jdf2gtfs/.temp/gtfs",
    stop_ids: {
        "5000501": "gensvobodu"
    },
    id_prefix: "TDTRENCIN:",
    locations: {},
    stop_codes: {},
    platforms: [
        {
            parent: "5000501",
            code: "A",
            location: [ 48.8748300, 18.0489801]
        }
    ],
    timezone: "Europe/Bratislava",
    lang: "sk",
    line_number_changes: {},
    line_colors: {},
    line_network: {},
    stops: [],
    stop_times_headsigns: {},
    years: [2022],
    line_route_type_override: {}
};

(async () => {
    let locs = await csv( { delimiter: ";" } ).fromFile("/workspaces/jdf2gtfs/.temp/tdtrencin11102022/ZastavkyData.csv")
    for (let li = 0; li < locs.length; li++) {
        const e = locs[li];
        console.log(e)
        config.locations[e.InterniCislo] = [((e["Zem�pisn� d�lka"]/10000).toFixed(4)), ((e["Zem�pisn� ���ka"]/ 10000).toFixed(4)), ]
        config.stop_codes[e.InterniCislo] = e.cisloCIS
    }

    console.log(config)

    let stops = await Stops(config);
    config.stops = stops
    let agencies = await Agencies(config)
    let routes = await Routes(config)
    let trips = await Trips(config)
    let stoptimes = await StopTimes(config)
    let calendar = await Calendar(config)
    let calendardates = await CalendarDates(config)
    let feedinfo = await FeedInfo(config)

    calendardates = removeDuplicatesCalDates(calendardates)

    let StopsCSV = await converter.json2csv(stops);
    let AgencyCSV = await converter.json2csv(agencies);
    let RoutesCSV = await converter.json2csv(routes);
    let TripsCSV = await converter.json2csv(trips);
    let StopTimesCSV = await converter.json2csv(stoptimes)
    let CalendarCSV = await converter.json2csv(calendar)
    let CalendarDatesCSV = await converter.json2csv(calendardates)
    let FeedInfoCSV = await converter.json2csv(feedinfo)

    fs.writeFileSync(path.join(config.output, "stops.txt"), StopsCSV)
    fs.writeFileSync(path.join(config.output, "agency.txt"), AgencyCSV)
    fs.writeFileSync(path.join(config.output, "routes.txt"), RoutesCSV)
    fs.writeFileSync(path.join(config.output, "trips.txt"), TripsCSV)
    fs.writeFileSync(path.join(config.output, "stop_times.txt"), StopTimesCSV)
    fs.writeFileSync(path.join(config.output, "calendar.txt"), CalendarCSV)
    fs.writeFileSync(path.join(config.output, "calendar_dates.txt"), CalendarDatesCSV)
    fs.writeFileSync(path.join(config.output, "feed_info.txt"), FeedInfoCSV)

})()