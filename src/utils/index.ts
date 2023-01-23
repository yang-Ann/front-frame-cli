import { EOL } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { exec } from "node:child_process";
import type { ExecOptions, ExecException } from "node:child_process";

import figlet from "figlet";
import chalk, { ChalkInstance } from "chalk";
import fs from "fs-extra";
import walkdir from "walkdir";
import ejs from "ejs";


const getDirname = (url: string): string => {
	return fileURLToPath(new URL(".", url));
}

// 转换为 ASCII
const strAsAscll = (msg: string, option?: figlet.Options): Promise<string> => {
	option = option || {
		font: "Varsity",
		horizontalLayout: "default",
		verticalLayout: "default",
		whitespaceBreak: true,
	};
	return new Promise((resolve, reject) => {
		figlet(msg, option, (err: Error | null, data: string | undefined) => {
			if (err) {
				console.log("err: ", err);
				reject(err);
			}
			if (data) resolve(data);
		});
	});
};

// 颜色 log
const colorLog = (type: LogColorType, ...msg: string[]): void => {
	const log = console.log;
	switch (type) {
		case "green":
			log(chalk.hex("#00ce6d")(msg));
			break;
		default:
			log(chalk[type](msg));
			break
	}
};

// 递归读取目录
const walkdirOpator = (
  dir: string, // 目录
  filter?: (p: string) => boolean | string, // 过滤器
  ignoreDirs = ["test", ".git", "node_modules"] // 忽略的目录
): Promise<string[] | Error> => {
  return new Promise((resolve, reject) => {

    const result: string[] = [];
    const emitter = walkdir(dir, function (filePath) {
        // 忽略
        if (ignoreDirs.includes(path.basename(filePath))) {
          this.ignore(filePath);
        }
        
        if (filter && typeof filter === "function") {
          const res = filter(filePath);
          if (typeof res === "boolean" && res) {
            result.push(filePath);
          } else if (typeof res === "string") {
            result.push(res);
          }
        } else {
          result.push(filePath);
        }
      }
    );

    emitter.on("end", () => {
      resolve(result);
    });

    emitter.on("error", error => {
      reject(error)
    });
  });
}

// 读取并填充ejs模板
const getEjsTemplate = (option: EjsOptionType): Promise<void> => {
	return new Promise((resolve, reject) => {
		try {
			const { targetPath, ejsData, generatePath, transition, deleteOriginFile } = option;
			const ejsStr = fs.readFileSync(targetPath, { encoding: "utf8" });
			let render = ejs.render(ejsStr, ejsData);
			render = (typeof transition === "function") ? transition(render) : delNullLine(render);
			fs.writeFileSync(generatePath, render, { encoding: "utf8" });
			if (deleteOriginFile) fs.removeSync(targetPath);
			resolve();
		} catch (error) {
			reject(error);
		}
	});
};

// 删除空行, 并根据指定的字符插入换行
const delNullLine = (text: string, symbol = "#BR#", isInsertBr = true): string => {
	// 替换换行, 防止错乱的换行
	let fullText = text.replace(/\n/g, EOL).replace(/\r\r\n/g, EOL) // 归一化换行符
										.split(EOL).filter(e => e.trim()).join(EOL); // 去掉换行

	// 替换特殊的符号(达到换行的效果)
	if (isInsertBr) {
		fullText = fullText.replace(new RegExp(symbol, "g"), "");
	}
	return fullText;
}

// 对象key排序
const objKeySort = (obj: ObjectType, flog: sortType = "ASC") => {
	const result: ObjectType = {};
	Object.keys(obj)
		.sort((a: string, b: string) => {
			return flog === "ASC"
				? a.localeCompare(b)
				: b.localeCompare(a)
		})
		.forEach((key: string) => result[key] = obj[key]);

	return result;
}

// 获取后缀名(.js .jsx .ts .tsx)
const getExtByLang = (lang: LanguageType, isJsx: boolean = false): ExtType => {
	const result = lang === "JavaScript" ? ".js" : ".ts";
	return (result + (isJsx ? "x" : "")) as ExtType;
}


// 判断是否可以转换为 json
const isJSON = (text: string): IsJSONRes => {
	const result = {
		json: null,
		flog: true,
	};

	try {
		result.json = JSON.parse(text);
	} catch (error) {
		result.flog = false;
	}

	return result;
}

// 子属性中是否还有对象
const isChildObject = (obj: ObjectType) : boolean => {
	let flog = false;
	for (const key in obj) {
		if (Object.prototype.hasOwnProperty.call(obj, key)) {
			const value = obj[key];
			if (value instanceof Object) {
				flog = true;
				break
			}
		}
	}
	return flog;
}



// 执行 shell 命令
const execShell = (
	command: string,
	option?: { encoding: "buffer" | null; } & ExecOptions,
): Promise<{stdout: string, stderr: string}> => {
	return new Promise((resolve, reject) => {
		exec(
			command,option || {},
			(error: ExecException  | null, stdout: string, stderr: string) => {
				if (error) reject(error);
				resolve({stdout, stderr});
		});
	});
}

export {
	getDirname,
	strAsAscll,
	colorLog,
	walkdirOpator,
	getEjsTemplate,
	delNullLine,
	objKeySort,
	getExtByLang,
	execShell,
	isJSON,
	isChildObject,
};
