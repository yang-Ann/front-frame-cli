import { Command } from "commander";
import chalk from "chalk";
import logSymbols from "log-symbols";
import inquirer from "inquirer";
import fs from "fs-extra";
import path from "node:path";

import Create from "./Create.js";
import { 
	// index
	colorLog,
	getDirname,

	// presetConfig
	getPresetConfig,
	getPersetConfigText,
	logPersetConfigText,
	delPresetConfig
} from "./utils/exports.js";

const { blue, yellow } = chalk;
const program = new Command();

const __dirname = getDirname(import.meta.url);
const pkg = fs.readJsonSync(path.resolve(__dirname, "../../package.json"));

program
	.name("ff")
	.description(pkg.description)
	.addHelpText(
		"afterAll",
		`

参数格式说明:
  尖括号表示${yellow("必选")}: 如: ${blue("<name>")}
  方括号表示${yellow("可选")}: 如: ${blue("[name]")}
  . 表示${yellow("变长参数")}: 如: ${blue("[name...]")}`
	)

	.version(pkg.version)
	.usage("<命令> [配置]");

// 创建命令
// 参数格式: 必选(尖括号), 可选(方括号), 变长参数(用.表示)
program
	.command("create [projectName]")
	.alias("c")
	.description("创建一个新的项目")
	.action(async (projectName: string) => {
		let projectDir = "";
		let isCurrent = false;
		const cwd = process.cwd();
		if (!projectName || [".", "./"].includes(projectName)) {
			// 当前目录创建
			projectDir = cwd;
			isCurrent = true;
		} else {
			if (projectName.startsWith("..")) {
				colorLog(
					"red",
					logSymbols.error,
					`不支持向上级目录创建项目, 只可以在${chalk.bold("当前目录")}或${chalk.bold("当前目录下")}创建`
				);
				process.exit(0);
			}
			// 指定目录
			projectDir = path.resolve(cwd, projectName);
			isCurrent = false;
		}

		const createInstance = new Create(projectDir, isCurrent);

		const presetAllOption = getPresetConfig();
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
							}
						})
					},
				]);
				const key = presetRes.preset.split(":")[0];
				const presetOption = presetAllOption[key];
				if (!presetOption) console.log(`预设【${key}】读取失败 ->`, presetOption);
				createInstance.run(presetOption);
			} else {
				createInstance.run();
			}
		} else {
			createInstance.run();
		}
	});

program
	.command("list")
	.alias("ls")
	.description("查看预设方案")
	.action(() => {
		logPersetConfigText();
	});

program
	.command("delete <presetName>")
	.alias("del")
	.description("删除预设方案")
	.action((presetName: string) => {
		const res = delPresetConfig(presetName);
		let tip = "删除一个预设配置 -> ";
		if (!res) tip = "删除失败, 请检查名称是否对应 -> ";
		console.log(tip + chalk.redBright(presetName));
	});

program.parse();
