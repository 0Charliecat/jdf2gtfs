import iconv from "iconv-lite"
import Papa from 'papaparse';

export async function getContentsArray<T>(_file: Uint8Array, _headers: string[]) {
	const _fileUTF8String = iconv.decode(
		_file as unknown as Buffer,
		'windows-1250'
	)

	let stringToParse = _headers.join(',') + "\r\n" + _fileUTF8String.trim().replaceAll('";', '"')

	let data = Papa.parse(
		stringToParse.trim(),
		{
			header: true,
			skipEmptyLines: true,
		}
	)
	return data.data as T[]
}
