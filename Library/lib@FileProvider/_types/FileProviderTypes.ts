export type JDFFileProvider = FeedZipBuffer
export interface FeedZipBuffer {
	type: "zipbuffer"
	contents: ArrayBuffer
}

export type JDFFileName = "verzejdf" | "zastavky" | "oznacniky" | "dopravci" | "linky" | "linext" | "zaslinky" | "spoje" | "spojskup" | "zasspoje" | "udaje" | "pevnykod" | "caskody" | "navaznosti" | "altdop" | "altlinky" | "mistenky"
export const JDFFileAllow = [
	"verzejdf", "zastavky", "oznacniky", "dopravci", "linky", "linext", "zaslinky", "spoje", "spojskup",
	"zasspoje", "udaje", "pevnykod", "caskody", "navaznosti", "altdop", "altlinky", "mistenky",
]
