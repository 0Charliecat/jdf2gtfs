# Build & Release

## Development setup

**Runtime and build tool: [Bun](https://bun.sh)**

```bash
bun install
```

No separate compile step is needed during development — Bun runs TypeScript directly.

---

## Running the integration tests

There is no automated test suite.

PLEASE TEST MANUALLY BEFORE PUBLISHING!

---

## Building for publishing

```bash
bun run prepublish
# equivalent:
bun build index.ts --outdir=. --sourcemap=external --packages=external --minify
```

This emits `index.js` + `index.js.map` in the repo root. These are what npm consumers import.

---

## Release checklist

1. Update the version in `package.json`.
2. Run `bun run prepublish` to regenerate `index.js` and `index.js.map`.
3. Commit `package.json`, `index.js`, and `index.js.map`.
4. Tag the commit (e.g. `v2.0.0-next-04`).
5. Publish: `npm publish` or `pnpm publish`.

The `.npmignore` excludes `Library/lib/` (deprecated JS), `testing.*`, and `RoadMap.md` from the published package.

---

## Dependency notes

| Package | Notes |
|---------|-------|
| `@isithere/gtfs` | GTFS entity classes. Pinned to exact pre-release — update carefully; field changes break serialisation |
| `neat-csv` | Active CSV parser used everywhere |
| `@fast-csv/parse` | **Unused** — `neat-csv` replaced it. Safe to remove |
| `iconv-lite` | Required for Windows-1250 decoding of JDF files |
| `jszip` | Reads input zips and creates output GTFS zip |
| `json-2-csv` | Serialises entity maps to CSV inside `FileProvider.createZip()` |
| `slovak-holidays` | Used in `core@calendar_dates` for holiday-aware calendar generation |
