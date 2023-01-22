import path from "node:path";
import fs from "fs-extra";
import chalk from "chalk";
import config from "../config/index.js";
import { colorLog } from "./index.js";
const optionDir = path.resolve(process.env.USERPROFILE || "", config.configDir);
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
// 打印预设内容
const logPersetConfigText = () => {
    const texts = getPersetConfigText();
    if (texts.length) {
        console.log(`\n从 ${optionDir} 中读取到的预设有: \n`);
        texts.map(e => {
            const { name, language, packages, git } = e;
            console.log(`\t${chalk.hex("#2ebc41").bold(name)}: language: ${language}, packages: [${packages.join(", ")}], git: ${git}\n`);
        });
    }
};
// 设置预设
const setPresetConfig = (key, value) => {
    const presetAllOption = getPresetConfig();
    if (presetAllOption[key]) {
        console.log(`更新了 ${chalk.bold.underline(key)} 预设配置`);
    }
    presetAllOption[key] = value;
    fs.writeJSONSync(presetPath, presetAllOption, { spaces: "\t" });
};
// 删除预设
const delPresetConfig = (key) => {
    let result = false;
    const preset = getPresetConfig();
    if (preset[key]) {
        result = true;
        delete preset[key];
        fs.writeJSONSync(presetPath, preset, { spaces: "\t" });
    }
    return result;
};
export { createOptionDir, getPresetConfig, getPersetConfigText, logPersetConfigText, setPresetConfig, delPresetConfig, };