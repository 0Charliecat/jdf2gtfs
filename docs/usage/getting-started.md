# Getting Started

## Installation

```bash
npm install jdf2gtfs
# or
pnpm add jdf2gtfs
```

## Minimal example

```ts
import { JDF2GTFS } from "jdf2gtfs"
import fs from "fs/promises"

const converter = new JDF2GTFS({
    fileProvider: {
        type: "zipfile",
        path: "/path/to/your/jdf.zip"
    },
    platforms: [],
    locations: {},
    lineColors: {
        default: { background: "ffffff", foreground: "000000" }
    }
})

const gtfsZip = await converter.makeAll()
await fs.writeFile("./gtfs.zip", gtfsZip)
```

`makeAll()` loads the JDF files, runs every generator in order, and returns a `Buffer` containing the GTFS zip. Write it to disk or pass it to your application directly.

## Generating entities individually

If you only need specific GTFS files, or want to inspect intermediate results, call the `make*()` methods individually. You must always call `loadFiles()` first.

```ts
await converter.loadFiles()

const stops = await converter.makeStops()
const routes = await converter.makeRoutes()
// stops is a Map<string, Stop> keyed by stop_id

const gtfsZip = await converter.zipEntities()
```

Available methods: `makeAgencies()`, `makeStops()`, `makeRoutes()`, `makeTrips()`, `makeStopTimes()`, `makeCalendars()`, `makeCalendarDates()`, `makeFeedInfo()`.

> **Note:** `makeStopTimes()` depends on `makeStops()` having run first (it calls `getStop()` internally). If you call generators individually, keep that order.

## What gets generated

| Method | Output file |
|--------|------------|
| `makeAgencies()` | `agency.txt` |
| `makeStops()` | `stops.txt` |
| `makeRoutes()` | `routes.txt` |
| `makeTrips()` | `trips.txt` |
| `makeStopTimes()` | `stop_times.txt` |
| `makeCalendars()` | `calendar.txt` |
| `makeCalendarDates()` | `calendar_dates.txt` |
| `makeFeedInfo()` | `feed_info.txt` |
