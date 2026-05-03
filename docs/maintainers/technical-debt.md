# Technical Debt

Known issues and cleanup items, roughly ordered by impact.

---

## Unimplemented: transfers

`core@transfers/` is a stub. `Navaznosti.txt` parsing and GTFS `transfers.txt` generation are not implemented. See `RoadMap.md` for the planned scope.

---

## Dead dependency: `@fast-csv/parse`

Listed in `dependencies` but not used anywhere — `neat-csv` replaced it. Removing it reduces install size with no code changes required.

---

## Typo in `feed_info` field name

`feed_puiblisher_url` (missing `l`) is a typo that propagates from the `@isithere/gtfs` package. Fixing it requires a coordinated change in both repos and a version bump. Do not silently fix it in one place only.

---

## `@ts-ignore` in `core@calendar_dates`

The calendar dates generator uses `@ts-ignore` in places where JDF's complex calendar logic (odd/even weeks, nested exceptions) can't be fully expressed in the current type system. These should be revisited when the odd/even week feature is implemented.

---

## Deprecated `/lib` directory

`Library/lib/` (and the repo-root `/lib` if present) contain old JavaScript files from before the TypeScript migration. They are excluded from npm via `.npmignore`. Once confirmed unused, delete them.

---

## Missing automated tests

The only validation is running `testing.nitra.ts` / `testing.ams.ts` manually and checking the output zip. A GTFS validator (e.g. `gtfs-validator` from MobilityData) should be run against the output as part of any release. Adding proper unit tests for the generators is a standing gap.

---

## Calendar generation TODOs

Several JDF calendar features are not yet handled — see `RoadMap.md` under "Calendar / Calendar Dates":

- Odd/even week schedules
- Czech holidays (only Slovak holidays are currently supported)
- `ONLY_GOES` CasKod type requiring destruction of a GTFS calendar entry
- `Altdop` support
