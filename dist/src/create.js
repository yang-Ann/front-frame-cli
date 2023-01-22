import path from "node:path";
import child_process from "node:child_process";
import inquirer from "inquirer";
import chalk from "chalk";
import fs from "fs-extra";
import ora from "ora";
import PackageInfo from "./PackageInfo.js";
import EjsFileMap from "./EjsFileMap.js";
import PackageFileMap from "./PackageFileMap.js";
import { execCommandOption } from "./config/command.js";
import { 
// index
getDirname, strAsAscll, colorLog, getEjsTemplate, delNullLine, isJSON, objKeySort, walkdirOpator, 
// presetConfig
getPresetConfig, setPresetConfig, logPersetConfigText, } from "./utils/exports.js";
const __dirname = getDirname(import.meta.url);
const rse = (desc, p) => path.resolve(desc, p);
const log = console.log;
export default class Create {
    projectDir;
    isCurrent;
    lastDir;
    templateParams;
    isCover;
    startTime;
    spinner;
    ejsFileMap;
    packageInfo;
    packageFileMap;
    constructor(projectDir, isCurrent) {
        this.projectDir = projectDir;
        this.isCurrent = isCurrent;
        // this.projectDir = projectDir; // 创建的项目目录
        // this.isCurrent = isCurrent; // 是否是当前目录
        this.lastDir = ""; // 目录名
        this.templateParams = null; // 模板参数
        this.isCover = false; // 是否覆盖目录
        this.spinner = ora("waiting..."); // 终端loading
        this.ejsFileMap = null; // 解析 ejs 文件实例
        this.packageInfo = null; // 解析 package.json 实例
        this.packageFileMap = null; // 解析 package 实例
        this.startTime = -1; // 记录时间
        this.init();
    }
    init() {
        this.normalizeProp();
    }
    // 运行
    async run(option) {
        try {
            await this.dirOver();
            if (option) {
                this.templateParams = option;
            }
            else {
                await this.execCommand();
            }
            this.startTime = Date.now();
            await this.loading()
                .initInstance()
                .copyTemplate()
                .copyPackageTemplate()
                .renderEjsTemplate();
            await this.initGit();
        }
        catch (error) {
            if (error instanceof Error) {
                this.spinner.fail(error.stack);
                fs.removeSync(this.projectDir);
                process.exit(1);
            }
        }
        finally {
            this.cleanup();
        }
    }
    // 参数归一化
    normalizeProp() {
        const projectDir = this.projectDir;
        this.projectDir = path.normalize(projectDir);
        const lastDir = projectDir.split(path.sep).pop();
        if (typeof lastDir === "string")
            this.lastDir = lastDir;
    }
    // 判断目录是否覆盖
    dirOver() {
        return new Promise(async (resolve) => {
            const { isCurrent, lastDir, projectDir } = this;
            const green = (msg) => chalk.hex("#00ce6d")(msg);
            if (isCurrent) {
                const dirRes = await inquirer.prompt([
                    {
                        name: "ok",
                        type: "confirm",
                        message: `在当前目录下创建项目吗?（${green(lastDir)}）`
                    }
                ]);
                if (!dirRes.ok)
                    process.exit(0);
            }
            else if (!isCurrent && fs.existsSync(projectDir)) {
                const coverRes = await inquirer.prompt([
                    {
                        name: "ok",
                        type: "confirm",
                        message: `当前目录下已存在（${green(lastDir)}）, 是否要覆盖(会清空目录)?`
                    }
                ]);
                if (coverRes.ok) {
                    this.isCover = true;
                }
                else {
                    process.exit(0);
                }
            }
            resolve();
        });
    }
    // 命令
    execCommand() {
        return new Promise(async (resolve) => {
            const { frame, language, packages } = execCommandOption;
            const langAndFra = await inquirer.prompt([
                {
                    name: "frame",
                    type: "list",
                    message: "请选择框架",
                    choices: frame
                },
                {
                    name: "language",
                    type: "list",
                    message: "选择使用的语言",
                    choices: language
                }
            ]);
            const pasAndGit = await inquirer.prompt([
                {
                    name: "packages",
                    type: "checkbox",
                    message: "选择需要的第三方类库",
                    pageSize: 20,
                    // suffix: "（空格单选, a 全选, i 反选, 回车确定）",
                    choices: packages(langAndFra.frame),
                },
                {
                    name: "git",
                    type: "confirm",
                    message: "是否要初始化git?"
                }
            ]);
            this.templateParams = {
                ...langAndFra,
                ...pasAndGit
            };
            // 预设设置
            let presetFlog = false;
            const presetAllOption = getPresetConfig();
            const presetAllOptionKeys = Object.keys(presetAllOption);
            if (presetAllOptionKeys.length === 0) {
                presetFlog = true;
            }
            else {
                const strPresetOption = presetAllOptionKeys.map((key) => {
                    const presetOption = presetAllOption[key];
                    return JSON.stringify(presetOption);
                });
                const isSome = strPresetOption.some((e) => e === JSON.stringify(this.templateParams));
                // 是否需要保存预设
                if (!isSome)
                    presetFlog = true;
            }
            if (presetFlog) {
                const savePresetRes = await inquirer.prompt([
                    {
                        name: "isSavePreset",
                        type: "confirm",
                        message: "是否要保存预设?"
                    }
                ]);
                if (savePresetRes.isSavePreset) {
                    logPersetConfigText();
                    const presetNameRes = await inquirer.prompt([
                        {
                            name: "presetKey",
                            type: "input",
                            message: `请输入保存为的预设名称(${chalk.bgBlue("与已有的预设名冲突则会覆盖")})`,
                            validate(input) {
                                if (input && input.trim()) {
                                    return true;
                                }
                                else {
                                    colorLog("red", "预设名不能为空");
                                    return false;
                                }
                            }
                        }
                    ]);
                    if (this.templateParams) {
                        setPresetConfig(presetNameRes.presetKey, this.templateParams);
                    }
                }
            }
            resolve();
        });
    }
    // log ASCLL 文本
    async logAscll() {
        const pkg = fs.readJsonSync(rse(__dirname, "../../package.json"));
        return new Promise(async (resolve) => {
            const str = await strAsAscll(pkg.name);
            colorLog("blue", str);
            resolve();
        });
    }
    // loading
    loading() {
        log();
        this.spinner.start();
        return this;
    }
    // 初始化子实例
    initInstance() {
        const { projectDir, templateParams } = this;
        const { language, packages, frame } = templateParams;
        this.ejsFileMap = new EjsFileMap(projectDir, language, templateParams);
        this.packageFileMap = new PackageFileMap(projectDir, language, frame, packages);
        this.packageInfo = new PackageInfo(language, frame, packages);
        return this;
    }
    // 拷贝语言模板
    copyTemplate() {
        const { isCover, lastDir, projectDir, templateParams } = this;
        const { language, packages, frame } = templateParams;
        if (isCover) {
            fs.removeSync(projectDir);
            fs.mkdirSync(projectDir);
        }
        // 拷贝模板
        fs.copySync(rse(__dirname, `../../assets/template/${frame}/${language}`), projectDir);
        // 初始化 README.md
        const readmeText = `- projectName: \`${lastDir}\`
- language: \`${language}\`
- frame: \`${frame}\`
- packages: \`${packages.join("`, `")}\`
- createDate: \`${new Date().toLocaleString().replace(/\//g, "-")}\``;
        fs.writeFileSync(rse(projectDir, "./README.md"), readmeText.replace(/``/g, "NULL"));
        return this;
    }
    // 处理第三方库模板
    copyPackageTemplate() {
        const selectPackages = this.packageFileMap?.getSelectPackages();
        selectPackages && selectPackages.forEach(map => {
            fs.copySync(map.from, map.to, { recursive: true });
        });
        return this;
    }
    // 批量转换ejs模板
    renderEjsTemplate() {
        return new Promise(async (resolve, reject) => {
            const { projectDir, templateParams, lastDir } = this;
            const file = await walkdirOpator(projectDir, p => p.endsWith(".ejs"));
            if (Array.isArray(file) && file.length) {
                const ioPros = file.map(item => {
                    const generateFileName = this.ejsFileMap?.getFileName(item);
                    // 解析 .ejs 文件
                    return getEjsTemplate({
                        targetPath: item,
                        ejsData: {
                            ...templateParams,
                            projectName: lastDir,
                        },
                        generatePath: rse(projectDir, generateFileName),
                        // 写入的数据转换函数
                        transition: (render) => {
                            let result = "";
                            if (generateFileName === "package.json") {
                                const { flog, json } = isJSON(render);
                                if (flog && json) {
                                    // 添加依赖和命令
                                    if (this.packageInfo) {
                                        const { dependencies, devDependencies } = this.packageInfo.parseDependencies();
                                        json.scripts = objKeySort(this.packageInfo.parseScripts());
                                        json.dependencies = objKeySort(dependencies);
                                        json.devDependencies = objKeySort(devDependencies);
                                    }
                                    result = JSON.stringify(json, null, 2);
                                }
                                else {
                                    console.warn("json 转换失败了 ->", generateFileName);
                                }
                            }
                            else {
                                result = render;
                            }
                            return delNullLine(result);
                        },
                        // 删除读取的 .ejs 文件
                        deleteOriginFile: true
                    });
                });
                Promise.all(ioPros)
                    .then(resolve)
                    .catch(reject);
            }
        });
    }
    // 初始化 git
    initGit() {
        return new Promise((resolve, reject) => {
            if (this.templateParams?.git) {
                const { projectDir, isCurrent, lastDir } = this;
                const command = `chcp 65001 && git init ${isCurrent ? "" : lastDir}`;
                child_process.exec(command, (error) => {
                    if (error) {
                        log("child_process error: ", error.message);
                        reject();
                        return;
                    }
                    if (this.packageInfo) {
                        fs.writeFileSync(rse(projectDir, "./.gitignore"), this.packageInfo.getIgnoreContent("Git"));
                        resolve();
                    }
                });
            }
            else {
                resolve();
            }
        });
    }
    // 清理
    cleanup() {
        const { isCurrent, lastDir, startTime } = this;
        const countTime = Date.now() - startTime;
        // ${chalk.hex("#00ce6d")(countTime + "ms")}
        this.spinner?.succeed(`用时: ${countTime}ms`);
        if (!isCurrent)
            colorLog("blue", `\n cd ${lastDir}`);
        colorLog("blue", ` npm install`);
        colorLog("blue", ` npm run dev\n`);
        // log(`Wait for the browser to open automatically...\n`);
    }
}
