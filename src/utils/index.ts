import { EOL } from "node:os";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
import { exec } from "node:child_process";
import type { ExecOptions, ExecException } from "node:child_process";

import updateNotifier, { type Package } from "update-notifier";
import figlet from "figlet";
import chalk from "chalk";
import fs from "fs-extra";
import ejs from "ejs";


// 缓存纯函数结果
type cachedFunc = (...any: any[]) => any;
const cached = (fn: cachedFunc): cachedFunc => {
	const cache = Object.create(null);
	return (...pars: any[]) => {
		const key = pars[0].toString();
		const hit = cache[key];
		return hit || (cache[key] = fn(...pars));
	};
};

const getDirname = (url: string): string => {
	return fileURLToPath(new URL(".", url));
}

const getPackageJson = cached((): ObjectType => {
	const __dirname = getDirname(import.meta.url);
	const pkg = fs.readJsonSync(resolve(__dirname, "../../package.json"));
	return pkg;
});

const updateTip = () => {
	const pkg = getPackageJson("PACKAGE.JSON");
	const notifier = updateNotifier({ pkg: (pkg as Package) });
	notifier.notify();
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
	updateTip,
	getDirname,
	getPackageJson,
	strAsAscll,
	colorLog,
	getEjsTemplate,
	delNullLine,
	objKeySort,
	getExtByLang,
	execShell,
	isJSON,
	isChildObject,
};
