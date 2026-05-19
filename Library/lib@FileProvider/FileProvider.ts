import JSZip from "jszip";
import { JDFFileAllow, JDFFileName } from "./_types/FileProviderTypes";
import { GTFSEntities } from "../_app/_types/GTFSEntities";
import Papa from "papaparse";

async function readZipBuffer(buffer: ArrayBuffer): Promise<Record<JDFFileName, Uint8Array>> {
	const zip = await JSZip.loadAsync(buffer);
	const files: Partial<Record<JDFFileName, Uint8Array>> = {};

	for (const filename of Object.keys(zip.files)) {
		let jdfFile = filename.toLowerCase().replace(".txt", "") as JDFFileName;
		if (JDFFileAllow.includes(jdfFile)) {
			files[jdfFile] = await zip.files[filename].async("uint8array");
		}
	}
	return files as Record<JDFFileName, Uint8Array>;
}

async function createZip(entities: Map<GTFSEntities, Map<string, { toJSON(): object }>>): Promise<ArrayBuffer> {
	const zip = new JSZip();
	await Promise.all(
		Array.from(entities.entries()).map(async ([entity, data]) => {
			zip.file(`${entity}.txt`, Papa.unparse([...data.values()].map((v) => v.toJSON())));
		})
	);
	return await zip.generateAsync({ type: "arraybuffer" });
}

export default {
	readZipBuffer,
	createZip
};
