import JSZip from "jszip";
import fs from "fs/promises";
import { JDFFileAllow, JDFFileName } from "./_types/FileProviderTypes";
import { GTFSEntities } from "../_app/_types/GTFSEntities";
import { json2csv } from "json-2-csv";

async function readZipBuffer(buffer) {
	const zip = await JSZip.loadAsync(buffer);
	const files = {};

	for (const filename of Object.keys(zip.files)) {
		let jdfFile = filename.toLowerCase().replace(".txt", "");
		if (JDFFileAllow.includes(jdfFile)) {
			files[jdfFile] = await zip.files[filename].async("nodebuffer");
		}
	}
	return files;
}

async function readZipPath(path) {
	return await readZipBuffer(await fs.readFile(path));
}

async function readFolder(path) {
	const files = {};
	const dir = await fs.readdir(path);

	for (const file of dir) {
		let jdfFile = file.toLowerCase().replace(".txt", "");
		if (JDFFileAllow.includes(jdfFile)) {
			files[jdfFile] = await fs.readFile(`${path}/${file}`);
		}
	}

	return files;
}

async function createZip(entities) {
	const zip = new JSZip();
	await Promise.all(
		//@ts-ignore
		Array.from(entities.entries()).map(async ([entity, data]) => {
			zip.file(`${entity}.txt`, await json2csv([...data.values()].map((v) => v.toJSON())));
			// return [entity, csv] as const;
		})
	);
	return await zip.generateAsync({ type: "nodebuffer" });
}

export default {
	readZipBuffer,
	readZipPath,
	readFolder,
	createZip
};
