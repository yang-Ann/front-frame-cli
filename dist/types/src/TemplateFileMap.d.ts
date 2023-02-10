export default class TemplateFileMap {
    projectDir: string;
    lang: LanguageType;
    templateParams: TemplateParamsType;
    constructor(projectDir: string, lang: LanguageType, templateParams: TemplateParamsType);
    private get fileMap();
    getFileName(filePath: string): string;
}
