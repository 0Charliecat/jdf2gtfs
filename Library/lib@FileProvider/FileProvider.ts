import AdmZip from "adm-zip";
import fs from "fs/promises"
import { JDFFileAllow, JDFFileName } from "./_types/FileProviderTypes";
import { GTFSEntities } from "../_app/_types/GTFSEntities";
import { json2csv } from "json-2-csv";

async function readZipBuffer(buffer: Buffer) {
	const zip = new AdmZip(buffer);
	const zipEntries = zip.getEntries();
	const files: { [file: string]: Buffer } = {};
	for (const zipEntry of zipEntries) {
		let jdfFile = zipEntry.entryName.toLowerCase().replace(".txt", "")

		if (JDFFileAllow.includes(jdfFile)) {
			files[jdfFile] = zipEntry.getData()
		}
	}
	return files;
}

async function readZipPath(path: string) {
	return await readZipBuffer(await fs.readFile(path))
}

async function readFolder(path: string) {
	const files: { [file: string]: Buffer } = {};
	const dir = await fs.readdir(path)

	for (const file of dir) {
		let jdfFile = file.toLowerCase().replace(".txt", "")

		if (JDFFileAllow.includes(jdfFile)) {
			files[jdfFile] = await fs.readFile(file)
		}
	}

	return files;
}

async function createZip(entities: Map<GTFSEntities, Map<string, any>>) {
	const zip = new AdmZip();
	for (const [entity, data] of entities) {
		let csv = await json2csv([...data.values()].map((v) => v.toJSON()))
		// console.log(csv)
		zip.addFile(entity + ".txt", Buffer.from(csv))
	}
	return zip.toBuffer()
}

export default {
	readZipBuffer,
	readZipPath,
	readFolder,
	createZip
}