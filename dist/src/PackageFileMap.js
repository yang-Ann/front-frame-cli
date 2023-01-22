import { resolve, parse } from "node:path";
import fs from "fs-extra";
import packageFileMapConfig from "./config/packageFileMap.js";
import { getDirname } from "./utils/exports.js";
const __dirname = getDirname(import.meta.url);
// 管理依赖文件映射
export default class PackageFileMap {
    projectDir;
    lang;
    frame;
    packages;
    constructor(projectDir, lang, frame, packages) {
        this.projectDir = projectDir;
        this.lang = lang;
        this.frame = frame;
        this.packages = packages;
    }
    get fileMap() {
        return packageFileMapConfig.fileMap;
    }
    // 获取选中的 package (参数兼容测试用例)
    getSelectPackages(customDir = __dirname) {
        const { fileMap, frame, packages, projectDir, lang } = this;
        // 从 dist 目录开始, 所有是 ../../
        const packagefromDir = resolve(customDir, `../../assets/template/${frame}/packages`);
        const result = [];
        // 框架依赖 + 通用依赖
        const allPackages = {
            ...fileMap[frame],
            ...fileMap.commonPackageMap
        };
        Object.keys(allPackages).forEach((pn) => {
            if (packages.includes(pn)) {
                const value = allPackages[pn];
                // 简写字符串格式
                if (typeof value === "string") {
                    result.push({
                        from: build(packagefromDir, `${pn}/${value}`, true),
                        to: build(projectDir, value)
                    });
                    // 数组格式
                }
                else if (Array.isArray(value)) {
                    value.forEach((e) => {
                        // 简写字符串格式
                        if (typeof e === "string") {
                            result.push({
                                from: build(packagefromDir, `${pn}/${e}`, true),
                                to: build(projectDir, e)
                            });
                            // 对象格式
                        }
                        else if (e instanceof Object) {
                            result.push({
                                from: build(packagefromDir, `${pn}/${e.from}`, true),
                                to: build(projectDir, e.to)
                            });
                        }
                    });
                }
            }
        });
        function build(fromDir, path, isFrom = false) {
            let result = "";
            // 是函数则调用并覆盖
            if (typeof path === "function")
                path = path(lang);
            result = resolve(fromDir, path);
            // 校验模板文件是否存在, 不存在则去公共目录中获取
            if (isFrom && !fs.existsSync(result)) {
                result = resolve(customDir, "../../assets/template/common/packages", path);
            }
            return result;
        }
        result
            .filter(e => {
            const { base, ext } = parse(e.to);
            // 不是 ignore 文件, 目标地址是目录
            return !base.startsWith(".") && !base.endsWith("ignore") && !ext;
        })
            .forEach(e => {
            const fromParse = parse(e.from);
            // 目标路径是目录则拼接上源文件名
            e.to = resolve(e.to, fromParse.base);
        });
        return result;
    }
}
