// 测试数据

import PackageInfo from "../PackageInfo.js";

const vuePackageInstance = new PackageInfo("TypeScript", "Vue", [
  "Axios",
  "Dayjs",
  "Element-Plus",
  "Eslint",
  "JSX(TSX)",
  "Lodash",
  "Pinia",
  "Prettier",
  "Sass",
  "Tailwind CSS",
  "Vue-router",
  "Vueuse"
]);

const reactPackageInstance = new PackageInfo("TypeScript", "React", [
  "Ant-Design",
  "Axios",
  "Dayjs",
  "Eslint",
  "Lodash",
  "Prettier",
  "React-router",
  "React-use",
  "Reducx",
  "Tailwind CSS"
]);

const nativePackageInstance = new PackageInfo("TypeScript", "Native", [
  "Axios",
  "Chalk",
  "Commander",
  "Dayjs",
  "Eslint",
  "Fs-extra",
  "Inquirer",
  "Lodash",
  "Log-symbols",
  "Ora",
  "Prettier",
  "Rollup",
  "Vitest"
]);


export {
  vuePackageInstance,
  reactPackageInstance,
  nativePackageInstance
}