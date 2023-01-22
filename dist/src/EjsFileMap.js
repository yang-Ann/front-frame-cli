import ejsFileMapConfig from "./config/ejsFileMap.js";
import { getExtByLang } from "./utils/exports.js";
// 管理 EJS 文件模板映射
export default class EjsFileMap {
    projectDir;
    lang;
    templateParams;
    constructor(projectDir, lang, templateParams) {
        this.projectDir = projectDir;
        this.lang = lang;
        this.templateParams = templateParams;
    }
    get fileMap() {
        return ejsFileMapConfig.fileMap;
    }
    // 查询文件
    getFileName(filePath) {
        const { projectDir, templateParams, fileMap } = this;
        const { frame, language, packages } = templateParams;
        // 获取 .ejs 对应的文件名
        const fileName = filePath.split(projectDir)[1] // 截取文件路径
            .slice(1) // 不要根目录
            .replace(/.ejs$/, "") // 替换 .ejs 后缀名
            .replace(/\\/g, "/"); // 路径分隔符替换为 /
        if (!fileName) {
            throw new Error(`没有读取到文件: ${filePath}, ${projectDir}`);
        }
        let map = {
            ...fileMap.Common.required || {},
            ...fileMap[frame].required || {},
        };
        // 选中的包添加到映射配置中
        [
            ...Object.keys(fileMap.Common),
            ...Object.keys(fileMap[frame])
        ].forEach(key => {
            const _key = key;
            if (packages.includes(_key)) {
                const v1 = fileMap[frame][_key] || {};
                const v2 = fileMap.Common[_key] || {};
                map = {
                    ...v1,
                    ...v2,
                    ...map, // required 不能被覆盖
                };
            }
        });
        // 获取ejs模板文件对应的后缀名
        let ext = map[fileName];
        if (typeof ext === "function") {
            ext = ext(language);
        }
        else if (!ext) {
            // 没有则自动匹配 .js 或 .ts
            ext = getExtByLang(language);
        }
        return fileName + ext;
    }
}
