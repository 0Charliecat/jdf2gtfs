# Configuration & Extension Points

All user-facing configuration is defined in `Library/_app/_types/ConverterConfiguration.ts`. Defaults are applied in the `JDF2GTFS` constructor in `index.ts`.

---

## Feature flags

`featureFlags` (defined in `Library/_app/_types/FeatureFlags.ts`) gate experimental or non-default behaviour. All flags default to `false`.

| Flag | Effect |
|------|--------|
| `useExtendedRouteTypes` | Use Google's extended GTFS route type codes instead of the base GTFS set |
| `ignoreCisloSpojeForDirection` | Skip using the trip number to infer `direction_id` |
| `useVerzeJDFIDAsFeedVersion` | Use the JDF feed ID as `feed_version` in `feed_info.txt` |
| `useTTValitityAsFeedValidity` | Derive `feed_start_date`/`feed_end_date` from timetable validity dates |
| `generateInSeatTransfersFromCaskody` | Generate in-seat transfer records from `CasKody` data |

**Adding a new flag:** add it to `FeatureFlags.ts`, default it to `false` in the constructor, then gate the behaviour inside the relevant generator with `self.featureFlags.<flagName>`.

---

## Entity change callbacks (`requestEntityChanges`)

Users can intercept and modify any entity during generation. The full callback interface is in `Library/_app/_types/RequestEntityChanges.ts`.

Each callback receives `{ gtfs, jdf }` (and `platform` for stops) and returns either `false` (no change) or a partial object to merge onto the entity.

Generators are responsible for calling the callback and applying the result. See [generators.md](./generators.md#calling-entity-change-callbacks) for the pattern.

---

## Overrides

`overrides.Route.ShortName` — a `Map<lineNumber, shortName>` to force a specific `route_short_name` for any line.

`overrides.Route.Type` — a `Map<lineNumber, RouteVehicleType>` to force a specific route type regardless of what JDF reports.

Both are stored as plain objects in configuration and converted to `Map` in the constructor.

---

## Custom platforms

`platforms: CustomPlatform[]` lets callers define boarding platforms that don't exist in the JDF `Zastavky.txt`. Each entry specifies a parent stop ID, a platform code, and an optional GPS position. Defined in `Library/_app/_types/CustomPlatform.ts`.

---

## Location overrides

`locations: Record<stopId, LongitudeLatitude>` overrides GPS coordinates for specific stops. Useful when JDF data lacks coordinates or has incorrect ones.

---

## Line colors

`lineColors: Record<lineKey, { background: HexCodeColor, foreground: HexCodeColor }>` sets `route_color`/`route_text_color` per line. The key `"default"` sets the fallback (defaults to white background, black text).

---

## ID prefix

`id_prefix: string` is prepended to all generated IDs. Use this when merging multiple JDF feeds into a single GTFS output to avoid ID collisions.

---

## Branded scalar types

`Library/_app/_types/Simples.ts` defines nominal aliases like `HexCodeColor`, `Timezone`, `LongitudeLatitude`. These are string/number aliases at runtime but give TypeScript callers better IntelliSense. Use them in new configuration fields instead of raw `string`.
