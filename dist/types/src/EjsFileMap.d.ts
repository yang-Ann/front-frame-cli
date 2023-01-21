export default class EjsFileMap {
    projectDir: string;
    lang: LanguageType;
    templateParams: TemplateParamsType;
    constructor(projectDir: string, lang: LanguageType, templateParams: TemplateParamsType);
    private get fileMap();
    getFileName(filePath: string): string;
}
