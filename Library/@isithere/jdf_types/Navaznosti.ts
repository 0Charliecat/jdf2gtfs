export interface Navaznosti {
	type: NavaznostiType
	lineNumber: string
	tripNumber: string
	tarrifNumber: string
	lineNumberContinued?: string
	stopIdContinued?: string
	platformIdContinued?: string
	stopIdTerminatatingContinuation?: string
	platformIdTerminatatingContinuation?: string
	timeWaited: string
	note: string
	lineResolution: string
}

export enum NavaznostiType {
	isWaitingFor = "m",
	isWaitedOn = "M"
}

export const headers = [
	"type",
	"lineNumber",
	"tripNumber",
	"tarrifNumber",
	"lineNumberContinued",
	"stopIdContinued",
	"platformIdContinued",
	"stopIdTerminatatingContinuation",
	"platformIdTerminatatingContinuation",
	"timeWaited",
	"note",
	"lineResolution"
]