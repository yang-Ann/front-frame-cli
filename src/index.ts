import { Command } from "commander";
import chalk from "chalk";

import { 
	// index
	getPackageJson,

	// presetConfig

	// command
	createProject,
	delPreset,
	logPersetConfigText
} from "./utils/exports.js";

const { blue, green } = chalk;
const program = new Command();

const pkg = getPackageJson("PACKAGE.JSON");

program
	.name("ff")
	.description(pkg.description)
	.addHelpText(
		"afterAll",
		`

参数格式说明:
  尖括号表示${green("必选")}: 如: ${blue("<name>")}
  方括号表示${green("可选")}: 如: ${blue("[name]")}
  . 表示${green("变长参数")}: 如: ${blue("[name...]")}`
	)

	.version(pkg.version)
	.usage("<命令> [配置]");

// 创建命令
// 参数格式: 必选(尖括号), 可选(方括号), 变长参数(用.表示)
program
	.command("create [projectName]")
	.alias("c")
	.description("创建一个新的项目")
  .option("-p, --preset <presetName>", "根据预设方案创建项目")
	.action(createProject);

program
	.command("list")
	.alias("ls")
	.description("查看预设方案")
	.action(logPersetConfigText);

program
	.command("delete <presetName>")
	.alias("del")
	.description("删除预设方案")
	.action(delPreset);

program.parse();
