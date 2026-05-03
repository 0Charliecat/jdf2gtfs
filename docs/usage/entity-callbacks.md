# Entity Callbacks

`requestEntityChanges` lets you modify any generated entity before it is written to the output. Set it in the constructor configuration.

Each callback receives the generated GTFS entity (`gtfs`) and the source JDF row (`jdf`) and must return either `false` (no change) or a partial object to merge onto the entity.

---

## Available callbacks

| Key | `gtfs` type | `jdf` type | Notes |
|-----|------------|-----------|-------|
| `Stops` | `Stop` | `Zastavky` or `CustomPlatform` | Platform stops pass `platform` instead of `jdf` |
| `Agencies` | `Agency` | `Dopravci` | |
| `Routes` | `Route` | `Linky` | |
| `Trips` | `Trip` | `Spoje` | |
| `StopTimes` | `StopTime` | `Zasspoje` | |
| `Calendars` | `Calendar` | `Spoje` | |
| `CalendarDates` | `CalendarDate` | `CasKody` | |

All callbacks are optional — omit any you don't need.

---

## Example: clean up agency contact details

```ts
requestEntityChanges: {
    Agencies: ({ gtfs, jdf }) => ({
        phone: gtfs.phone!.replace("09", "+421 9"),
        url: "https://example.sk",
        fareURL: "https://example.sk/tickets/"
    })
}
```

---

## Example: trim route names

JDF sometimes stores the line number inside the long name. Strip it:

```ts
requestEntityChanges: {
    Routes: ({ gtfs, jdf }) => ({
        shortName: String(+gtfs.shortName!),   // remove zero-padding
        longName: gtfs.longName!.replace(gtfs.shortName!, "").trim()
    })
}
```

---

## Example: rename platform stops

```ts
requestEntityChanges: {
    Stops: ({ gtfs }) => {
        if (gtfs.name!.includes("Platform"))
            return { name: gtfs.name!.replace("Platform ", "(") + ")" }
        return false
    }
}
```

Returning `false` leaves the entity unchanged. You can return `false` from any branch.

---

## Example: assign stop times to a platform

If your JDF data doesn't include platform assignments but you know all trips use platform A:

```ts
requestEntityChanges: {
    StopTimes: ({ gtfs }) => {
        if (!gtfs.stop!.includes("_"))
            return { stop: gtfs.stop + "_A" }
        return false
    }
}
```

---

## Notes

- The returned object is shallowly merged onto the entity. Only the fields you return are changed.
- Returning `false`, `null`, `undefined`, or any falsy value leaves the entity unchanged.
- Callbacks run synchronously — async callbacks are not supported.
- The `gtfs` object reflects the entity as generated so far; the `jdf` object is the raw source row.
