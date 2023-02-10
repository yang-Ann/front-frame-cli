import chalk from "chalk";
import logSymbols from "log-symbols";
import inquirer from "inquirer";
import path from "node:path";
import Create from "../Create.js";
import { 
// index
updateTip, colorLog, 
// presetConfig
getPresetConfig, getPersetConfigText, delPresetConfig, optionDir, } from "./exports.js";
// create 命令
const createProject = async (projectName, option) => {
    updateTip();
    let projectDir = "";
    let isCurrent = false;
    const cwd = process.cwd();
    if (!projectName || [".", "./"].includes(projectName)) {
        // 当前目录创建
        projectDir = cwd;
        isCurrent = true;
    }
    else {
        if (projectName.startsWith("..")) {
            colorLog("red", logSymbols.error, `不支持向上级目录创建项目, 只可以在${chalk.bold("当前目录")}或${chalk.bold("当前目录下")}创建`);
            process.exit(0);
        }
        // 指定目录
        projectDir = path.resolve(cwd, projectName);
        isCurrent = false;
    }
    const createInstance = new Create(projectDir, isCurrent);
    const presetAllOption = getPresetConfig();
    if (option.preset) {
        const preOpt = presetAllOption[option.preset];
        if (preOpt) {
            createInstance.run(preOpt);
        }
        else {
            console.log(`\n该预设不存在, 请检查 -> ${chalk.redBright(option.preset)}`);
            logPersetConfigText();
        }
        return;
    }
    const presetNum = Object.keys(presetAllOption).length;
    if (presetNum > 0) {
        const isPresetRes = await inquirer.prompt([
            {
                name: "usePreset",
                type: "list",
                message: `读取到有${presetNum}个预设, 是否使用预设的配置?`,
                choices: [
                    { name: "选择预设配置", checked: true },
                    { name: "自定义配置" },
                ],
            },
        ]);
        if (isPresetRes.usePreset === "选择预设配置") {
            const presetRes = await inquirer.prompt([
                {
                    name: "preset",
                    type: "list",
                    pageSize: 10,
                    message: `请选择一个预设配置?`,
                    choices: getPersetConfigText().map(e => {
                        const { name, language, packages, git } = e;
                        return {
                            name: `${name}: language: ${language}, packages: [${packages.join(", ")}], git: ${git}\n`
                        };
                    })
                },
            ]);
            const key = presetRes.preset.split(":")[0];
            const presetOption = presetAllOption[key];
            if (!presetOption)
                console.log(`预设【${key}】读取失败 ->`, presetOption);
            createInstance.run(presetOption);
        }
        else {
            createInstance.run();
        }
    }
    else {
        createInstance.run();
    }
};
// list 命令
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
// delete 命令
const delPreset = (presetName) => {
    const res = delPresetConfig(presetName);
    let tip = "删除一个预设配置 -> ";
    if (!res)
        tip = "删除失败, 请检查名称是否对应 -> ";
    console.log(tip + chalk.redBright(presetName));
};
export { createProject, delPreset, logPersetConfigText };
