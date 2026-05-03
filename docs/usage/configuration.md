# Configuration Reference

All options are passed to the `JDF2GTFS` constructor.

---

## `fileProvider` *(required)*

Where to load the JDF package from. See [File Providers](./file-providers.md) for details.

---

## `platforms`

Array of custom platform definitions to add to `stops.txt`. Each entry creates a child stop under a parent station.

```ts
platforms: [
    {
        parent: "5000501",   // stop_id of the parent station in Zastavky.txt
        code: "A",           // platform letter/number, appended to the parent ID
        location: [48.8748300, 18.0489801]  // [latitude, longitude], optional
    }
]
```

Type: `CustomPlatform[]` — defaults to `[]`.

---

## `locations`

GPS coordinate overrides for stops, keyed by stop ID. Use this when the JDF data has missing or incorrect coordinates.

```ts
locations: {
    "5000501": [48.8748300, 18.0489801]
}
```

Type: `Record<stopId, [latitude, longitude]>` — defaults to `{}`.

---

## `lineColors`

Per-line colors for `route_color` and `route_text_color` in `routes.txt`. The `default` key is required and sets the fallback color for any line not explicitly listed. Values are hex color codes without the `#`.

```ts
lineColors: {
    default: { background: "2268b4", foreground: "ffffff" },
    "000042": { background: "e30613", foreground: "ffffff" }
}
```

---

## `feed_info`

Populates `feed_info.txt`. All fields are optional — omitting this entirely generates a placeholder entry.

```ts
feed_info: {
    feed_publisher_name: "My Transit Agency",
    feed_puiblisher_url: "https://example.com",   // note: typo in field name is intentional, matches upstream package
    feed_lang: "sk",
    feed_contact_email: "gtfs@example.com",
    feed_contact_url: "https://example.com/contact",
    feed_version: "2025-01",
    feed_start_date: "20250101",
    feed_end_date: "20251231"
}
```

The `feed_version`, `feed_start_date`, and `feed_end_date` fields can be derived automatically from the JDF data using [feature flags](./feature-flags.md).

---

## `timezone`

IANA timezone string used when generating calendar data.

```ts
timezone: "Europe/Bratislava"  // default
```

---

## `id_prefix`

String prepended to all generated IDs (`stop_id`, `route_id`, etc.). Use this when merging multiple JDF feeds into one GTFS output to prevent ID collisions.

```ts
id_prefix: "nitra_"
```

Defaults to `""` (no prefix).

---

## `stop_ids`

Overrides the generated `stop_id` for specific stops, keyed by the original JDF stop ID.

```ts
stop_ids: {
    "5000501": "my-custom-id"
}
```

---

## `stop_codes`

Overrides the `stop_code` field for specific stops, keyed by JDF stop ID.

```ts
stop_codes: {
    "5000501": "NR-MAIN"
}
```

---

## `overrides`

Hard overrides for specific route fields, keyed by the JDF line number (zero-padded to 6 digits).

```ts
overrides: {
    Route: {
        ShortName: {
            "000001": "1",    // force route_short_name for line 000001
            "000042": "X42"
        },
        Type: {
            "000099": 3       // force route_type (3 = bus)
        }
    }
}
```

`Type` values can be standard GTFS route types (0–12) or extended types when `useExtendedRouteTypes` is enabled.

---

## `requestEntityChanges`

Callbacks to modify individual entities during generation. See [Entity Callbacks](./entity-callbacks.md).

---

## `featureFlags`

Opt-in experimental behaviour. See [Feature Flags](./feature-flags.md).
