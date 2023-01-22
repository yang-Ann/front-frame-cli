import figlet from "figlet";
import chalk from "chalk";
import fs from "fs-extra";
import { EOL } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import walkdir from "walkdir";
import ejs from "ejs";
const getDirname = (url) => {
    return fileURLToPath(new URL(".", url));
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
        case "brightBlue":
            log(chalk.hex("#10cdff")(msg));
            break;
        default:
            log(chalk[type](msg));
            break;
    }
};
// 递归读取目录
const walkdirOpator = (dir, // 目录
filter, // 过滤器
ignoreDirs = ["test", ".git", "node_modules"] // 忽略的目录
) => {
    return new Promise((resolve, reject) => {
        const result = [];
        const emitter = walkdir(dir, function (filePath) {
            // 忽略
            if (ignoreDirs.includes(path.basename(filePath))) {
                this.ignore(filePath);
            }
            if (filter && typeof filter === "function") {
                const res = filter(filePath);
                if (typeof res === "boolean" && res) {
                    result.push(filePath);
                }
                else if (typeof res === "string") {
                    result.push(res);
                }
            }
            else {
                result.push(filePath);
            }
        });
        emitter.on("end", () => {
            resolve(result);
        });
        emitter.on("error", error => {
            reject(error);
        });
    });
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
export { getDirname, strAsAscll, colorLog, walkdirOpator, getEjsTemplate, delNullLine, isJSON, objKeySort, getExtByLang, };