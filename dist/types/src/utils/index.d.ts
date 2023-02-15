import type { ExecOptions } from "node:child_process";
import figlet from "figlet";
declare type cachedFunc = (...any: any[]) => any;
declare const getDirname: (url: string) => string;
declare const getPackageJson: cachedFunc;
declare const updateTip: () => void;
declare const strAsAscll: (msg: string, option?: figlet.Options) => Promise<string>;
declare const colorLog: (type: LogColorType, ...msg: string[]) => void;
declare const getEjsTemplate: (option: EjsOptionType) => Promise<void>;
declare const delNullLine: (text: string, symbol?: string, isInsertBr?: boolean) => string;
declare const objKeySort: (obj: ObjectType, flog?: sortType) => ObjectType<any>;
declare const getExtByLang: (lang: LanguageType, isJsx?: boolean) => ExtType;
declare const isJSON: (text: string) => IsJSONRes;
declare const isChildObject: (obj: ObjectType) => boolean;
declare const execShell: (command: string, option?: {
    encoding: "buffer" | null;
} & ExecOptions) => Promise<{
    stdout: string;
    stderr: string;
}>;
export { updateTip, getDirname, getPackageJson, strAsAscll, colorLog, getEjsTemplate, delNullLine, objKeySort, getExtByLang, execShell, isJSON, isChildObject, };
