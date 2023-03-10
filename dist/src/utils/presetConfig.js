import path from "node:path";
import fs from "fs-extra";
import chalk from "chalk";
import config from "../config/index.js";
import { colorLog, getDirname } from "./exports.js";
const __dirname = getDirname(import.meta.url);
const optionDir = path.resolve(process.env.USERPROFILE || __dirname, config.configDir);
const presetPath = path.resolve(optionDir, config.presetFile);
// 创建配置目录
const createOptionDir = () => {
    if (!fs.existsSync(optionDir))
        fs.mkdirSync(optionDir);
    return optionDir;
};
// 获取预设配置
const getPresetConfig = () => {
    const optionDir = createOptionDir();
    const presetPath = path.resolve(optionDir, config.presetFile);
    let result;
    if (!fs.existsSync(presetPath)) {
        fs.writeJSONSync(presetPath, {});
        result = {};
    }
    else {
        try {
            result = fs.readJSONSync(presetPath) || {};
        }
        catch (error) {
            if (error instanceof Error) {
                colorLog("red", `读取预设配置错误 ---> ${error.message}`);
                result = {};
            }
        }
    }
    return result;
};
// 获取预设提示(格式样式)
const getPersetConfigText = () => {
    let result = [];
    const presetAllOption = getPresetConfig();
    const presetAllOptionKeys = Object.keys(presetAllOption);
    if (presetAllOptionKeys.length) {
        result = presetAllOptionKeys.map(key => {
            const item = presetAllOption[key];
            return {
                name: key,
                language: chalk.bold.underline(item.language),
                packages: item.packages.map(e => chalk.bold.underline(e)),
                git: chalk.bold.underline(item.git)
            };
        });
    }
    return result;
};
// 设置预设
const setPresetConfig = (key, value) => {
    const presetAllOption = getPresetConfig();
    if (presetAllOption[key]) {
        console.log(`更新了 ${chalk.bold.underline(key)} 预设配置`);
    }
    presetAllOption[key] = value;
    fs.writeJSONSync(presetPath, presetAllOption, { spaces: "  " });
};
// 删除预设
const delPresetConfig = (key) => {
    let result = false;
    const preset = getPresetConfig();
    if (preset[key]) {
        result = true;
        delete preset[key];
        fs.writeJSONSync(presetPath, preset, { spaces: "  " });
    }
    return result;
};
export { optionDir, presetPath, createOptionDir, getPresetConfig, getPersetConfigText, setPresetConfig, delPresetConfig, };
