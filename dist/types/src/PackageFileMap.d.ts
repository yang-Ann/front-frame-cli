export default class PackageFileMap {
    projectDir: string;
    lang: LanguageType;
    frame: FrameType;
    packages: Array<PackagesType>;
    constructor(projectDir: string, lang: LanguageType, frame: FrameType, packages: Array<PackagesType>);
    private get fileMap();
    getSelectPackages(customDir?: string): PackageFileMapType[];
}
