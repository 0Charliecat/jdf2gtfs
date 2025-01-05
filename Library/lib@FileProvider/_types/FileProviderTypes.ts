export type JDFFileProvider = FeedZipBuffer | FeedZipFile | FeedFolder
export interface FeedZipBuffer {
	type: "zipbuffer"
	contents: Buffer
}
export interface FeedZipFile {
	type: "zipfile"
	path: string
}

export interface FeedFolder {
	type: "folder"
	path: string
}

export type JDFFileName = "verzejdf" | "zastavky" | "oznacniky" | "dopravci" | "linky" | "linext" | "zaslinky" | "spoje" | "spojskup" | "zasspoje" | "udaje" | "pevnykod" | "caskody" | "navaznosti" | "altdop" | "altlinky" | "mistenky"
export const JDFFileAllow = [
	"verzejdf", "zastavky", "oznacniky", "dopravci", "linky", "linext", "zaslinky", "spoje", "spojskup",
	"zasspoje", "udaje", "pevnykod", "caskody", "navaznosti", "altdop", "altlinky", "mistenky"
]
