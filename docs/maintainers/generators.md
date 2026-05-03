# Generators

Each GTFS output file is produced by a dedicated generator module under `Library/core@<entity>/`. All generators share the same contract.

---

## Generator contract

A generator is an async default export that receives the `JDF2GTFS` instance and returns a `Map<string, EntityType>`:

```ts
import { JDF2GTFS } from "../../.."

export default async function generateRoutes(self: JDF2GTFS): Promise<Map<string, Route>> {
    const rows = await getContentsArray<Linky>(self.getFile("Linky.txt")!)
    const result = new Map<string, Route>()
    // ... build entities ...
    return result
}
```

The map key is the entity's primary ID (e.g. `route_id`). The `JDF2GTFS` class stores the returned map in `_entities` under the relevant `GTFSEntities` key.

---

## Existing generators

| Module | Output file | Primary JDF input |
|--------|------------|------------------|
| `core@agencies` | `agency.txt` | `Dopravci.txt` |
| `core@stops` | `stops.txt` | `Zastavky.txt` + custom platforms |
| `core@routes` | `routes.txt` | `Linky.txt` |
| `core@trips` | `trips.txt` | `Spoje.txt` + PevnyKod |
| `core@stop_times` | `stop_times.txt` | `Zasspoje.txt` |
| `core@calendar` | `calendar.txt` | `Spoje.txt` (fixed codes) |
| `core@calendar_dates` | `calendar_dates.txt` | `CasKody.txt` |
| `core@feed_info` | `feed_info.txt` | `VerzeJDF.txt` + config |
| `core@pevnykod` | *(internal only)* | `PevnyKod.txt` |
| `core@transfers` | `transfers.txt` | **stub — not implemented** |

---

## Adding a new generator

1. **Create the module** at `Library/core@<entity>/index.ts` with a default async export matching the generator contract above.

2. **Register a `make*()` method** on `JDF2GTFS` in `index.ts`:
   ```ts
   async makeTransfers() {
       const Transfers = await import("./Library/core@transfers/index")
       let generated = await Transfers.default(this)
       this._entities.set("transfers", generated)
       return generated
   }
   ```
   Dynamic imports are intentional — they keep the module lazy and match the existing pattern.

3. **Add to `makeAll()`** in the correct position. Respect entity dependencies:
   - `stops` must be populated before `stop_times` (stop_times calls `self.getStop()`)
   - `pevnykod` is populated by `loadFiles()`, so it is always available

4. **Add the entity key** to the `GTFSEntities` union in `Library/_app/_types/GTFSEntities.ts`.

5. **Verify `FileProvider.createZip()`** maps the new key to the correct output filename (e.g. `"transfers"` → `transfers.txt`).

---

## Calling entity change callbacks

Generators that respect `requestEntityChanges` should call the relevant callback for each entity before inserting it into the result map:

```ts
const changes = self.requestEntityChanges.Routes?.({ gtfs: route, jdf: row })
if (changes) Object.assign(route, changes)
```

Return value of `false` (the default no-op) means no changes. Any truthy object is merged onto the entity. See `Library/_app/_types/RequestEntityChanges.ts` for the full callback signatures.

---

## Midnight-crossing in stop times

`core@stop_times` contains logic to handle trips that run past midnight. JDF times can exceed `23:59` (e.g. `24:30`) to indicate the next calendar day — this maps directly to GTFS's own convention. Read the inline comments in that module before modifying it.
