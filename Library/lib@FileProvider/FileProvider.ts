import JSZip from "jszip";
import fs from "fs/promises";
import { JDFFileAllow, JDFFileName } from "./_types/FileProviderTypes";
import { GTFSEntities } from "../_app/_types/GTFSEntities";
import { json2csv } from "json-2-csv";

async function readZipBuffer(buffer: Buffer): Promise<Record<JDFFileName, Buffer>> {
	const zip = await JSZip.loadAsync(buffer);
	const files: Partial<Record<JDFFileName, Buffer>> = {};

	for (const filename of Object.keys(zip.files)) {
		let jdfFile = filename.toLowerCase().replace(".txt", "") as JDFFileName;
		if (JDFFileAllow.includes(jdfFile)) {
			files[jdfFile] = await zip.files[filename].async("nodebuffer");
		}
	}
	return files as Record<JDFFileName, Buffer>;
}

async function readZipPath(path: string): Promise<Record<JDFFileName, Buffer>> {
	return await readZipBuffer(await fs.readFile(path));
}

async function readFolder(path: string): Promise<Record<JDFFileName, Buffer>> {
	const files: Partial<Record<JDFFileName, Buffer>> = {};
	const dir = await fs.readdir(path);

	for (const file of dir) {
		let jdfFile = file.toLowerCase().replace(".txt", "") as JDFFileName;
		if (JDFFileAllow.includes(jdfFile)) {
			files[jdfFile] = await fs.readFile(`${path}/${file}`);
		}
	}

	return files as Record<JDFFileName, Buffer>;
}

async function createZip(entities: Map<GTFSEntities, Map<string, { toJSON(): object }>>): Promise<Buffer> {
	const zip = new JSZip();
	await Promise.all(
		Array.from(entities.entries()).map(async ([entity, data]) => {
			zip.file(`${entity}.txt`, await json2csv([...data.values()].map((v) => v.toJSON())));
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
