import csv from "csvtojson"
import fs from "fs"
import path from "path"
import iconv from "iconv-lite"

export async function getContentsArray(_path: string, _headers: string[]) {
	const _fileUTF8String = iconv.decode(
		fs.readFileSync(path.join(_path, 'zastavky.txt')),
		'windows-1250'
	)

	return await csv().fromString(
		_headers.join(',') +
		"\r\n" +
		_fileUTF8String
	)
}