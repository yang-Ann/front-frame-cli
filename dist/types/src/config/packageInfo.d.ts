export declare const devDependenciesInfo: {
    Vue: string | string[] | import("../types/defineConfig.js").DependenciesType;
    React: string | string[] | import("../types/defineConfig.js").DependenciesType;
    Native: string | string[] | import("../types/defineConfig.js").DependenciesType;
    buildTool: string | string[] | import("../types/defineConfig.js").DependenciesType;
    Common: string | string[] | import("../types/defineConfig.js").DependenciesType;
    devDependenciesMap: string | string[] | import("../types/defineConfig.js").DependenciesType;
    devDependenciesRule: string | string[] | import("../types/defineConfig.js").DependenciesType;
}, scriptInfo: {
    Vue: {
        [x: string]: string | {
            [x: string]: string;
        } | ((lang: LanguageType) => string) | {
            [x: string]: ((lang: LanguageType) => string) | ((lang: LanguageType, frame: FrameType) => string);
        };
    };
    React: {
        [x: string]: string | {
            [x: string]: string;
        } | ((lang: LanguageType) => string) | {
            [x: string]: ((lang: LanguageType) => string) | ((lang: LanguageType, frame: FrameType) => string);
        };
    };
    Native: {
        [x: string]: string | {
            [x: string]: string;
        } | ((lang: LanguageType) => string) | {
            [x: string]: ((lang: LanguageType) => string) | ((lang: LanguageType, frame: FrameType) => string);
        };
    };
    Common: {
        [x: string]: string | {
            [x: string]: string;
        } | ((lang: LanguageType) => string) | {
            [x: string]: ((lang: LanguageType) => string) | ((lang: LanguageType, frame: FrameType) => string);
        };
    };
}, getIgnoreContent: (packageName: PackagesType | "Git") => string;
