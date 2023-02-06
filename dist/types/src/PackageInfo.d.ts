export default class PackageInfo {
    language: LanguageType;
    frame: FrameType;
    packages: Array<PackagesType>;
    constructor(language: LanguageType, frame: FrameType, packages: Array<PackagesType>);
    private static get allPackageInfo();
    static get allScripts(): {
        Vue: {
            [x: string]: string | ((lang: LanguageType) => string) | {
                [x: string]: string;
            } | {
                [x: string]: ((lang: LanguageType) => string) | ((lang: LanguageType, frame: FrameType) => string);
            };
        };
        React: {
            [x: string]: string | ((lang: LanguageType) => string) | {
                [x: string]: string;
            } | {
                [x: string]: ((lang: LanguageType) => string) | ((lang: LanguageType, frame: FrameType) => string);
            };
        };
        Native: {
            [x: string]: string | ((lang: LanguageType) => string) | {
                [x: string]: string;
            } | {
                [x: string]: ((lang: LanguageType) => string) | ((lang: LanguageType, frame: FrameType) => string);
            };
        };
        Common: {
            [x: string]: string | ((lang: LanguageType) => string) | {
                [x: string]: string;
            } | {
                [x: string]: ((lang: LanguageType) => string) | ((lang: LanguageType, frame: FrameType) => string);
            };
        };
    };
    getFrameAllPackages(): any;
    parseAllDependencies(): ObjectType<any>;
    parseDependencies(): {
        devDependencies: ObjectType<any>;
        dependencies: ObjectType<any>;
    };
    parseScripts(): ObjectType<any>;
    getIgnoreContent(packageName: PackagesType | "Git"): string;
}
