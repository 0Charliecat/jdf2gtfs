import neatCsv from 'neat-csv';
import iconv from "iconv-lite"

export async function getContentsArray(_file: Buffer, _headers: string[]) {
	const _fileUTF8String = iconv.decode(
		_file,
		'windows-1250'
	)

	let data = await neatCsv(
		_headers.join(',') +
		"\r\n" +
		_fileUTF8String.trim().replaceAll('";', '"')
	) as any[]
	
	return data
}
