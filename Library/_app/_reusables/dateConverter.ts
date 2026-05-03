export function dateConverter(ddmmyyyy: string) {
	let yyyy = ddmmyyyy.substring(4, 8)
	let mm = ddmmyyyy.substring(2, 4)
	let dd = ddmmyyyy.substring(0, 2)
	return (new Date(parseInt(yyyy), parseInt(mm) - 1, parseInt(dd), 0, 0, 0))
}