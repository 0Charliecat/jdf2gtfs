# JDF Format

JDF (Jízdní řád Data Format) is the Czech/Slovak national standard for publishing public transit timetables. Files are semicolon-delimited CSVs encoded in **Windows-1250**.

---

## File reference

Each JDF file maps to a TypeScript interface in `Library/@isithere/jdf_types/`. Valid filenames are defined as the `JDFFileName` union in `lib@FileProvider/_types/FileProviderTypes.ts`.

| JDF file | Interface | Contents |
|----------|-----------|---------|
| `Zastavky.txt` | `Zastavky` | Stops/stations codebook |
| `Linky.txt` | `Linky` | Routes (lines) |
| `Spoje.txt` | `Spoje` | Trips |
| `Zasspoje.txt` | `Zasspoje` | Stop times |
| `Dopravci.txt` | `Dopravci` | Agencies/carriers |
| `CasKody.txt` | `CasKody` | Calendar exceptions (date ranges, exception type) |
| `PevnyKod.txt` | `PevnyKod` | Fixed codes — single-char modifiers on trips and stops |
| `VerzeJDF.txt` | `VerzeJDF` | Feed metadata and JDF version |
| `Navaznosti.txt` | `Navaznosti` | Transfer information between trips |
| `LinExt.txt` | `LinExt` | Extended line info (IDS/MHD network association) |

Not all files are required in every JDF package. Use `self.hasFile(filename)` before reading optional files.

---

## Reading a JDF file in a generator

The `getContentsArray()` helper decodes Windows-1250, parses the CSV, and returns a typed array:

```ts
import getContentsArray from "../../_app/_reusables/getContentsArray"
import { Linky, headers as linkyHeaders } from "../../@isithere/jdf_types/Linky"

const rows: Linky[] = await getContentsArray(self.getFile("linky")!, linkyHeaders)
```

Pass the generic type parameter — it is not validated at runtime, it just gives you typed access to the fields.

---

## PevnyKod (fixed codes)

`PevnyKod.txt` attaches single-character modifier codes to trips and individual stop calls. These affect scheduling, accessibility, on-board services, and stop behaviour.

`core@pevnykod` parses this file after `loadFiles()` and stores a lookup map on the `JDF2GTFS` instance. Import the lookup helpers from `core@pevnykod` in any generator that needs them. See `Library/@isithere/jdf_types/PevnyKod.ts` for the full code reference with translations.

---

## Date format

JDF dates are in `DDMMYYYY` format (no separators). Use the `dateConverter` utility in `_app/_reusables/dateConverter.ts` to convert them to JavaScript `Date` objects.

---

## Encoding note

The `iconv-lite` dependency handles Windows-1250 → UTF-8 conversion inside `getContentsArray()`. Do not read JDF buffers with Node's default UTF-8 encoding — diacritics in Czech/Slovak place names will be corrupted.
