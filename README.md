# `jdf2gtfs`

> *a javascript dependency to convert Czechoslovak JDF timetable format to GTFS*

---

## What is this?

A Dependency used by IsItHere to create GTFS feeds from JDF packaged timetables. This is a simple, db-less and customisable dependency.

## Usage

```ts
import { JDF2GTFS } from "jdf2gtfs";
import fs from "fs/promises"

const file = await fs.readFile("/path/to/jdf.zip")
const arrayBuffer = file.buffer.slice(file.byteOffset, file.byteOffset + file.byteLength)

const runner = new JDF2GTFS({
    fileProvider: {
        type: "zipbuffer",
        contents: arrayBuffer
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

const output = await runner.makeAll()
await fs.writeFile("./gtfs.zip", Buffer.from(output))
```

The library is isomorphic — `fileProvider.contents` is a plain `ArrayBuffer`, so the same code works in Node.js, browsers, Deno, and Bun. In a browser, get the `ArrayBuffer` from `fetch(...).then(r => r.arrayBuffer())` or `file.arrayBuffer()` instead.