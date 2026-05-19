import Papa from 'papaparse';
import * as windows1250 from 'windows-1250';

export async function getContentsArray<T>(_file: Uint8Array, _headers: string[]) {
	const _fileUTF8String = windows1250.decode(_file);

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
