type PersetConfigTextType = {
  name: string,
  language: string,
  packages: string[],
  git: string,
}

type IsJSONRes = {
  json: ObjectType | null;
  flog: boolean;
};

type ObjectType<V = any> = Record<string, V>

type ExtType = ".js" | ".jsx" | ".ts" | ".tsx";

type sortType = "ASC" | "DESC";

type LogColorType = "red" | "blue" | "blueBright" | "yellow" | "green";

type LanguageType = "JavaScript" | "TypeScript";
type FrameType = "Vue" | "React" | "Native";
type BuildTool = "Vite";
type VuePackages = "Element-Plus" | "Vue-router" | "Pinia" | "JSX(TSX)" | "Vueuse" | "Sass";
type ReactPackages = "Ant-Design" | "Reducx" | "React-router" | "React-use";
type NativePackages = "Rollup" | "Vitest" | "Fs-extra" | "Chalk" | "Log-symbols" | "Ora" | "Commander" | "Inquirer" | "Puppeteer-core";
type CommonType = "Axios" | "Prettier" | "Eslint" | "Lodash" | "Dayjs" | "Tailwind CSS" | "Commitlint" | "Husky";
type PackagesType = VuePackages | ReactPackages | NativePackages | CommonType;

type PackageFileMapType = {
  from: string,
  to: string,
}

type TemplateParamsType = {
  language: LanguageType,
  frame: FrameType,
  packages: Array<PackagesType>,
  git: boolean,
};

type ejsDataType = Partial<TemplateParamsType> & { 
  projectName?: string,
  env: NodeJS.ProcessEnv,
};

type EjsOptionType = {
  targetPath: string, // 读取路径
  ejsData: ejsDataType, // 模板需要的数据
  generatePath: string, // 写入的路径
  transition?: (render: string) => string, // 数据转换
  deleteOriginFile?: boolean, // 是否删除读取的文件
};