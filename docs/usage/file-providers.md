# File Providers

The `fileProvider` option tells the converter where to read the JDF package from.

---

## `zipbuffer` — read from an ArrayBuffer

```ts
fileProvider: {
    type: "zipbuffer",
    contents: arrayBuffer   // ArrayBuffer
}
```

Pass any `ArrayBuffer` containing the zip. This is the only supported source type, which keeps the library isomorphic — it works in Node.js, browsers, Deno, and Bun without modification.

### Node.js example

```ts
import fs from "fs/promises"

const contents = await fs.readFile("/path/to/jdf.zip")
// Buffer is a subclass of Uint8Array — extract its underlying ArrayBuffer
const arrayBuffer = contents.buffer.slice(contents.byteOffset, contents.byteOffset + contents.byteLength)

fileProvider: {
    type: "zipbuffer",
    contents: arrayBuffer
}
```

### Browser example

```ts
// From a fetch response
const response = await fetch("https://example.com/jdf.zip")
const arrayBuffer = await response.arrayBuffer()

fileProvider: {
    type: "zipbuffer",
    contents: arrayBuffer
}

// From a file input
const [file] = input.files
const arrayBuffer = await file.arrayBuffer()
```
