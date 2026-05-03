# File Providers

The `fileProvider` option tells the converter where to read the JDF package from. Three source types are supported.

---

## `zipfile` — read from a path on disk

```ts
fileProvider: {
    type: "zipfile",
    path: "/path/to/jdf.zip"
}
```

The zip is read from disk at the time `loadFiles()` (or `makeAll()`) is called.

---

## `zipbuffer` — read from a Buffer in memory

```ts
import fs from "fs/promises"

const contents = await fs.readFile("/path/to/jdf.zip")

fileProvider: {
    type: "zipbuffer",
    contents: contents   // Buffer
}
```

Useful when you have already loaded the zip into memory, for example after downloading it from a remote source.

---

## `folder` — read from an unpacked directory

```ts
fileProvider: {
    type: "folder",
    path: "/path/to/unpacked-jdf/"
}
```

The directory must contain the JDF CSV files directly (e.g. `Zastavky.txt`, `Linky.txt`, etc.). Use this during development when you want to inspect or modify individual files without re-zipping.
