# `jdf2gtfs`

> *a nodejs script and dependency to convert Czechoslovak JDF timetable format to GTFS*

---

## What is this?

A Dependency used by IsItHere to create GTFS feeds from JDF packaged timetables. This is a simple, db-less and customisable dependency.

## Usage

```javascript
const JDF2GTFS = require("jdf2gtfs")

const runner = new JDF2GTFS({
    path: "/Users/0charliecat/Github/jdf2gtfs/.temp/tdtn11122022",
    output: "/Users/0charliecat/Desktop/GTFS/tdtn11122022",
    locations: {},
    stop_codes: {},
    platforms: [{
        parent: "5000501",
        code: "A",
        location: [48.8748300, 18.0489801]
    }],
    timezone: "Europe/Bratislava",
    lang: "sk",
})

runner.make().then(()=>console.log("DONE!"))
```

## API

- the config - `<JDF2GTFS>.constructor(e)`
   - `path` string **REQUIRED** - the path where JDF package is located
   - `output` string - the path where the GTFS Feed is exported - defaults to `path`/gtfs
   - `id_prefix` string - prefix for the ids used - defaults to empty string
   - `locations` object **REQUIRED** - sets the longitude, latitude
      - `<stop_id>` array **REQUIRED** - [Number, Number]
   - `stop_codes` object - sets the `stop_code` property of the stop
      - `<stop_id>` string
   - `platforms` array **REQUIRED** - adds platforms as stops
      - object
         - `parent` string **REQUIRED** - Valid Parent stop id
         - `code` string **REQUIRED** - platform number or code
         - `location` array **REQUIRED** - [Number, Number]
   - `timezone` string - valid timezone id - defaults to `Europe/Bratislava`
   - `lang` string - valid language id - defaults to `sk`
   - `line_number_changes` object - changes the `Linky.number`
      - `<route_id>` string
   - `line_colors` object - sets the line colors
      - `background` string - hex code of the color
      - `foreground` string - hex code of the color
   - `line_network` object - sets the `network_id` property of the route
      - `<route_id>` string - network id
   - `years` array - years to create exeptions for national holidays (slovak)
      - [Number] - year
   - `line_route_type_override` object - overrides JDF route types
      - `<route_id>` Enum - Default GTFS Route Types or Google Extended GTFS ([https://developers.google.com/transit/gtfs/reference/extended-route-types](https://developers.google.com/transit/gtfs/reference/extended-route-types))
   - `feed_publisher_name` string **REQUIRED** - feed publisher's name
   - `feed_publisher_url` string **REQUIRED** - feed publisher's url
   - `start_date` string - GTFS date of start of the feed - defaults to earliest timetable start of the lines
   - `end_date` string - gtfs date of the end of the feed - defaults to latest timetable start of the lines
   - `feed_contact_email` string - feed publisher's contact email
   - `feed_contact_url` string - feed publisher's contact url
- maker - `<JDF2GTFS>.make()` async function
   - makes the feed and writes it to the disk
- Stops Generator - `JDF2GTFS.Stops(config: <JDF2GTFS>)` async function
   - generates the stops and returns Objects
- Agency Generator - `JDF2GTFS.Agencies((config: <JDF2GTFS>)` async function
   - generates the agencies and returns Objects
- Routes Generator - `JDF2GTFS.Routes((config: <JDF2GTFS>)` async function
   - generates the lines and returns Objects
- Trips Generator - `JDF2GTFS.Trips((config: <JDF2GTFS>)` async function
   - generates the trips and returns Objects
- Stop_Times Generator - `JDF2GTFS.StopTimes((config: <JDF2GTFS>)` async function
   - generates stop_times and returns objects
- Calendar Generator - `JDF2GTFS.Calendar((config: <JDF2GTFS>)` async function
   - generates the calendar for services and returns objects
- Calendar_Dates Generator - `JDF2GTFS.CalendarDates((config: <JDF2GTFS>)` async function
   - generates the calendar_dates and returns objects
- Feed_Info Generator - `JDF2GTFS.FeedInfo((config: <JDF2GTFS>)` async function
   - generates feed info based on the config
- classes `JDF2GTFS.classes`
- enums `JDF2GTFS.enums` - JDF Pevny Kod Enums


