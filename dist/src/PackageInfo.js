import { devDependenciesInfo, scriptInfo, getIgnoreContent } from "./config/packageInfo.js";
import { isChildObject } from "./utils/exports.js";
export default class PackageInfo {
    language;
    frame;
    packages;
    constructor(language, frame, packages) {
        this.language = language;
        this.frame = frame;
        this.packages = packages;
    }
    static get allPackageInfo() {
        return devDependenciesInfo;
    }
    static get allScripts() {
        return scriptInfo;
    }
    // 获取框架的所有依赖
    getFrameAllPackages() {
        const { frame, language } = this;
        const allPackageInfo = PackageInfo.allPackageInfo;
        const { buildTool, Common } = allPackageInfo;
        const frameAllPackages = allPackageInfo[frame] || {};
        const { dependencies, Packages } = frameAllPackages || {};
        const buildToolDepe = frameAllPackages.Packages[buildTool] || {};
        const langPackages = frameAllPackages.Packages[language] || {};
        return {
            ...dependencies,
            ...Packages,
            ...buildToolDepe,
            ...Common.Packages,
            ...langPackages,
        };
    }
    // 解析所有的依赖
    parseAllDependencies() {
        const { language, frame, packages } = this;
        const buildTool = PackageInfo.allPackageInfo.buildTool;
        const frameAllPackages = this.getFrameAllPackages();
        let result = {};
        for (const key in frameAllPackages) {
            const value = frameAllPackages[key];
            // 必须依赖
            if (typeof value === "string") {
                result[key] = value;
                // 可选依赖
            }
            else if (value instanceof Object) {
                // 选中的依赖
                if (packages.includes(key) || key === language || key === buildTool) {
                    if (isChildObject(value)) {
                        // 还有还有子依赖则解析
                        const res = parse(value);
                        result = { ...result, ...res };
                    }
                    else {
                        result = { ...result, ...value };
                    }
                }
            }
        }
        // 解析依赖
        function parse(value) {
            const dependencies = value.dependencies || {};
            const langPackages = value[language] || {};
            const framePackages = value[frame] || {};
            let common = value.Common || {};
            common = common[language] || {};
            return {
                ...dependencies,
                ...langPackages,
                ...framePackages,
                ...common,
            };
        }
        return result;
    }
    // 解析依赖(区分生产依赖和运行依赖)
    parseDependencies() {
        const { devDependenciesMap, devDependenciesRule } = PackageInfo.allPackageInfo;
        const devDependencies = {};
        const dependencies = {};
        const currentAllDependencies = this.parseAllDependencies();
        for (const key in currentAllDependencies) {
            if (Object.prototype.hasOwnProperty.call(currentAllDependencies, key)) {
                const value = currentAllDependencies[key];
                if (devDependenciesMap.includes(key) || // 指定为开发依赖
                    devDependenciesRule.some(e => key.indexOf(e) !== -1) // 匹配指定规则
                ) {
                    // 添加到开发依赖
                    devDependencies[key] = value;
                }
                else {
                    dependencies[key] = value;
                }
            }
        }
        return {
            devDependencies,
            dependencies,
        };
    }
    // 解析命令
    parseScripts() {
        const { language, frame, packages } = this;
        const allScripts = PackageInfo.allScripts;
        const frameScript = allScripts[frame] || {};
        const commonScript = allScripts.Common || {};
        let frameAllScripts = {
            ...frameScript,
        };
        for (const key in commonScript) {
            const scripts = commonScript[key];
            if (packages.includes(key)) {
                frameAllScripts = {
                    ...frameAllScripts,
                    ...scripts
                };
            }
        }
        for (const key in frameAllScripts) {
            const script = frameAllScripts[key];
            if (typeof script === "function") {
                frameAllScripts[key] = script(language, frame);
            }
        }
        return frameAllScripts;
    }
    // TODO ignore 文件内容
    getIgnoreContent(packageName) {
        return getIgnoreContent(packageName);
    }
}
