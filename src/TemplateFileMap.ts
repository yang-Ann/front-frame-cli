import templateFileMapConfig from "./config/templateFileMap.js";
import { getExtByLang } from "./utils/exports.js";

// 管理 EJS 文件模板映射
export default class TemplateFileMap {

  constructor(
    public projectDir: string,
    public lang: LanguageType,
    public templateParams: TemplateParamsType
  ) {

  }

  private get fileMap() {
    return templateFileMapConfig.fileMap;
  }

  // 查询文件
  public getFileName(filePath: string): string {
    const { projectDir, templateParams, fileMap } = this;
    const { frame, language, packages } = templateParams;

    const fileName = filePath.replace(/.ejs$/, "") // 替换 .ejs 后缀名

    if (!fileName) {
      throw new Error(`没有读取到文件: ${filePath}, ${projectDir}`);
    }

    let map: ObjectType = {
      ...fileMap.Common.required || {},
      ...fileMap[frame].required || {},
    };

    // 选中的包添加到映射配置中
    [
      ...Object.keys(fileMap.Common),
      ...Object.keys(fileMap[frame])
    ].forEach(key => {
      const _key = key as PackagesType;
      if (packages.includes(_key)) {
        const v1 = fileMap[frame][_key] || {};
        const v2 = fileMap.Common[_key] || {};
        map = {
          ...v1,
          ...v2,
          ...map, // required 不能被覆盖
        }
      }
    });

    // 获取ejs模板文件对应的后缀名
    let ext = map[fileName];

    if (typeof ext === "function") {
      ext = ext(language);
    } else if (!ext) {
      // 没有则自动匹配 .js 或 .ts
      ext = getExtByLang(language);
    }

    return fileName + ext;
  }
}