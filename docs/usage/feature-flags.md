# Feature Flags

Feature flags enable opt-in behaviour that is off by default. Pass them under `featureFlags` in the constructor.

All flags default to `false`. You only need to list the ones you want to enable.

```ts
featureFlags: {
    useVerzeJDFIDAsFeedVersion: true,
    useTTValitityAsFeedValidity: true
}
```

---

## `useExtendedRouteTypes`

Uses Google's [extended GTFS route type codes](https://developers.google.com/transit/gtfs/reference/extended-route-types) instead of the base GTFS set (0–12). Extended types allow more specific vehicle classifications (e.g. `700` for bus, `800` for trolleybus, `900` for tram).

Enable this if your downstream consumer supports extended route types and you need finer-grained vehicle classification.

---

## `ignoreCisloSpojeForDirection`

By default, the converter infers `direction_id` from the trip number (`CisloSpoje`): even numbers → direction 0, odd numbers → direction 1. Enable this flag to skip that inference and leave `direction_id` unset.

Use this when the trip numbering in your JDF data does not follow the even/odd convention.

---

## `useVerzeJDFIDAsFeedVersion`

Populates `feed_version` in `feed_info.txt` with the feed ID or production date from `VerzeJDF.txt`. Without this flag, `feed_version` is left empty unless you set it manually in `feed_info`.

---

## `useTTValitityAsFeedValidity`

Derives `feed_start_date` and `feed_end_date` in `feed_info.txt` from the timetable validity dates in the JDF data. Without this flag, those fields are left empty unless you set them manually in `feed_info`.

---

## `generateInSeatTransfersFromCaskody`

When a JDF `CasKod` note indicates that passengers can remain seated through a vehicle change (an in-seat transfer), this flag generates the corresponding `transfer_type=4` record and assigns a shared `block_id` to the linked trips.

This is an experimental flag. The transfers output file is not yet fully implemented — use with caution.
