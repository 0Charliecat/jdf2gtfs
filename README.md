# `jdf2gtfs`

> *a javascript dependency to convert Czechoslovak JDF timetable format to GTFS*

---

## What is this?

A Dependency used by IsItHere to create GTFS feeds from JDF packaged timetables. This is a simple, db-less and customisable dependency.

## Usage

```javascript
import { JDF2GTFS } from "jdf2gtfs";
import fs from "fs"

const runner = new JDF2GTFS({
	fileProvider: {
		type: "zipfile",
		path: "/Users/0charliecat/Downloads/MHDTN_JDF.zip"
	},
    locations: {},
    stop_codes: {},
    platforms: [{
        parent: "5000501",
        code: "A",
        location: [48.8748300, 18.0489801]
    }],
    timezone: "Europe/Bratislava",
})

runner.makeAll().then(output => fs.writeFileSync("./gtfs.zip", output))
```