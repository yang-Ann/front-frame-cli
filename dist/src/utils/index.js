import { EOL } from "node:os";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
import { exec } from "node:child_process";
import updateNotifier from "update-notifier";
import figlet from "figlet";
import chalk from "chalk";
import fs from "fs-extra";
import ejs from "ejs";
const cached = (fn) => {
    const cache = Object.create(null);
    return (...pars) => {
        const key = pars[0].toString();
        const hit = cache[key];
        return hit || (cache[key] = fn(...pars));
    };
};
const getDirname = (url) => {
    return fileURLToPath(new URL(".", url));
};
const getPackageJson = cached(() => {
    const __dirname = getDirname(import.meta.url);
    const pkg = fs.readJsonSync(resolve(__dirname, "../../package.json"));
    return pkg;
});
const updateTip = () => {
    const pkg = getPackageJson("PACKAGE.JSON");
    const notifier = updateNotifier({ pkg: pkg });
    notifier.notify();
};
// 转换为 ASCII
const strAsAscll = (msg, option) => {
    option = option || {
        font: "Varsity",
        horizontalLayout: "default",
        verticalLayout: "default",
        whitespaceBreak: true,
    };
    return new Promise((resolve, reject) => {
        figlet(msg, option, (err, data) => {
            if (err) {
                console.log("err: ", err);
                reject(err);
            }
            if (data)
                resolve(data);
        });
    });
};
// 颜色 log
const colorLog = (type, ...msg) => {
    const log = console.log;
    switch (type) {
        case "green":
            log(chalk.hex("#00ce6d")(msg));
            break;
        default:
            log(chalk[type](msg));
            break;
    }
};
// 读取并填充ejs模板
const getEjsTemplate = (option) => {
    return new Promise((resolve, reject) => {
        try {
            const { targetPath, ejsData, generatePath, transition, deleteOriginFile } = option;
            const ejsStr = fs.readFileSync(targetPath, { encoding: "utf8" });
            let render = ejs.render(ejsStr, ejsData);
            render = (typeof transition === "function") ? transition(render) : delNullLine(render);
            fs.writeFileSync(generatePath, render, { encoding: "utf8" });
            if (deleteOriginFile)
                fs.removeSync(targetPath);
            resolve();
        }
        catch (error) {
            reject(error);
        }
    });
};
// 删除空行, 并根据指定的字符插入换行
const delNullLine = (text, symbol = "#BR#", isInsertBr = true) => {
    // 替换换行, 防止错乱的换行
    let fullText = text.replace(/\n/g, EOL).replace(/\r\r\n/g, EOL) // 归一化换行符
        .split(EOL).filter(e => e.trim()).join(EOL); // 去掉换行
    // 替换特殊的符号(达到换行的效果)
    if (isInsertBr) {
        fullText = fullText.replace(new RegExp(symbol, "g"), "");
    }
    return fullText;
};
// 对象key排序
const objKeySort = (obj, flog = "ASC") => {
    const result = {};
    Object.keys(obj)
        .sort((a, b) => {
        return flog === "ASC"
            ? a.localeCompare(b)
            : b.localeCompare(a);
    })
        .forEach((key) => result[key] = obj[key]);
    return result;
};
// 获取后缀名(.js .jsx .ts .tsx)
const getExtByLang = (lang, isJsx = false) => {
    const result = lang === "JavaScript" ? ".js" : ".ts";
    return (result + (isJsx ? "x" : ""));
};
// 判断是否可以转换为 json
const isJSON = (text) => {
    const result = {
        json: null,
        flog: true,
    };
    try {
        result.json = JSON.parse(text);
    }
    catch (error) {
        result.flog = false;
    }
    return result;
};
// 子属性中是否还有对象
const isChildObject = (obj) => {
    let flog = false;
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            const value = obj[key];
            if (value instanceof Object) {
                flog = true;
                break;
            }
        }
    }
    return flog;
};
// 执行 shell 命令
const execShell = (command, option) => {
    return new Promise((resolve, reject) => {
        exec(command, option || {}, (error, stdout, stderr) => {
            if (error)
                reject(error);
            resolve({ stdout, stderr });
        });
    });
};
export { updateTip, getDirname, getPackageJson, strAsAscll, colorLog, getEjsTemplate, delNullLine, objKeySort, getExtByLang, execShell, isJSON, isChildObject, };
