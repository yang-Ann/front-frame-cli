import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import fs from "fs-extra";
import Create from "./Create.js";
import { nativePackageInstance } from "./test/const.js";
const __dirname = fileURLToPath(new URL(".", import.meta.url));
const dirPath = resolve(__dirname, "../../aTestProject");
if (fs.existsSync(dirPath)) {
    fs.rmSync(dirPath, { recursive: true });
    console.log(`删除 ${dirPath} \n`);
}
const createInstance = new Create(dirPath, false);
const option = {
    language: "TypeScript",
    // frame: vuePackageInstance.frame,
    // packages: vuePackageInstance.packages,
    frame: nativePackageInstance.frame,
    packages: ["Eslint", "Puppeteer-core", "Vitest"],
    git: false,
};
createInstance.run(option);
