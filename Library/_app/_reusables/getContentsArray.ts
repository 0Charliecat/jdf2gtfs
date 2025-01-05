import csv from "csvtojson"
import iconv from "iconv-lite"

export async function getContentsArray(_file: Buffer, _headers: string[]) {
	const _fileUTF8String = iconv.decode(
		_file,
		'windows-1250'
	)

	return await csv().fromString(
		_headers.join(',') +
		"\r\n" +
		_fileUTF8String.replaceAll('";', '"')
	)
}