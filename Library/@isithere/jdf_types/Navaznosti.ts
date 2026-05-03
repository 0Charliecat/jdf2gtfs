export interface Navaznosti {
	type: NavaznostiType
	lineNumber: string
	tripNumber: string
	tariffNumber: string
	lineNumberContinued?: string
	stopIdContinued?: string
	platformIdContinued?: string
	stopIdTerminatingContinuation?: string
	platformIdTerminatingContinuation?: string
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
	"tariffNumber",
	"lineNumberContinued",
	"stopIdContinued",
	"platformIdContinued",
	"stopIdTerminatingContinuation",
	"platformIdTerminatingContinuation",
	"timeWaited",
	"note",
	"lineResolution"
]