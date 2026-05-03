# Architecture

## What this library does

`jdf2gtfs` converts **JDF** (JEDNOTNÝ DATOVÝ FORMÁT) — the Czech/Slovak public transit timetable standard — into **GTFS** (General Transit Feed Specification). JDF input is a zip of Windows-1250 encoded CSVs. GTFS output is also a zip of CSVs.

The library is database-less and stateless between runs. A single conversion is one `JDF2GTFS` instance configured once, then run.

---

## Data flow

```
Configuration
  └─ JDF2GTFS constructor    merges defaults, stores all config on instance
       └─ loadFiles()         reads zip/folder → Map<filename, Buffer>
            └─ SetupPevnyKod  parses PevnyKod.txt, stores lookup on instance
                 └─ make*()   each generator reads _loadedFiles,
                 |             writes into _entities
                 └─ zipEntities()  serialises _entities → GTFS zip Buffer
```

`makeAll()` runs every step in order and returns the final zip buffer.

---

## Repository layout

```
index.ts                         # JDF2GTFS class — entry point
Library/
  _app/
    _types/                      # Shared TypeScript interfaces
    _reusables/                  # Shared utilities (CSV parsing, date conversion)
  @isithere/jdf_types/           # TypeScript interfaces for every JDF CSV file
  core@agencies/                 # Generator → agency.txt
  core@stops/                    # Generator → stops.txt
  core@routes/                   # Generator → routes.txt
  core@trips/                    # Generator → trips.txt
  core@stop_times/               # Generator → stop_times.txt
  core@calendar/                 # Generator → calendar.txt
  core@calendar_dates/           # Generator → calendar_dates.txt
  core@feed_info/                # Generator → feed_info.txt
  core@pevnykod/                 # Parses PevnyKod.txt into a lookup map
  core@transfers/                # Stub — not yet implemented
  helper@fileHeaders/            # Legacy CSV header maps (partially used)
  lib@FileProvider/              # ZIP and folder I/O abstraction
```

### Module prefix conventions

| Prefix | Meaning |
|--------|---------|
| `core@` | GTFS entity generator |
| `lib@` | Low-level utility library |
| `helper@` | Miscellaneous helper |

---

## `JDF2GTFS` instance as shared context

Every generator receives the full `JDF2GTFS` instance. Generators use:

| Accessor | Purpose |
|----------|---------|
| `self.getFile(filename)` | Raw `Buffer` for a JDF CSV file |
| `self.hasFile(filename)` | Check if a file was present in the input |
| `self.getStop(id)` | A previously generated `Stop` entity (used by stop_times) |
| `self.platforms` | Custom platform definitions |
| `self.locations` | GPS coordinate overrides |
| `self.lineColors` | Per-line color config |
| `self.featureFlags` | Opt-in experimental behaviour |
| `self.requestEntityChanges` | Per-entity user callbacks |

Generators must not mutate `self._loadedFiles` or call other `make*()` methods directly. Cross-generator dependencies (e.g. stop_times depending on stops) are satisfied by the fixed run order in `makeAll()`.

---

## Entity storage

```ts
_entities: Map<GTFSEntities, Map<string, any>>
```

Each `make*()` method populates one key in this map with `Map<entityId, entityObject>`. `zipEntities()` iterates the whole map to build the output zip.
