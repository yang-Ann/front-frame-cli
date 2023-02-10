type ObjectStringType = ObjectType<string>;
type getExtOrFileNameFnType = (lang: LanguageType) => string;

type ConfigPackageFileMapType = {
  fileMap: {
    [p in FrameType | "commonPackageMap"]: {
      [p in PackagesType]?: Array<{
        from: string,
        to: string | getExtOrFileNameFnType,
      } | string>
    }
  }
}

export function defineConfigPackageFileMap(config: ConfigPackageFileMapType) {
  return config;
}

////

type EjsFileMapConfigType = {
  fileMap: {
    [p in FrameType | "Common"]: {
      [p in PackagesType | "required"]?: ObjectType<string | getExtOrFileNameFnType | null> 
    }
  }
}

export function defineConfigTemplateFileMap(config: EjsFileMapConfigType) {
  return config;
}

////

export type DependenciesType = {
  dependencies?: ObjectStringType,
  Packages?: {
    [k in PackagesType | BuildTool | LanguageType]?: 
      ObjectStringType | 
      { [k in FrameType | "dependencies" | "Common"]: ObjectStringType | DependenciesType } | 
      { [k in LanguageType | "dependencies"]?: ObjectStringType };
  },
  TypeScript?: ObjectStringType,
  JavaScript?: ObjectStringType,
};

type ScriptFnType = Record<string, string | getExtOrFileNameFnType | ObjectStringType | {
  [k in string]: getExtOrFileNameFnType |
  ((lang: LanguageType, frame: FrameType) => string)
}>;

type fileInfoConfigType = {
  devDependenciesInfo: {
    [k in FrameType | "buildTool" | "Common" | "devDependenciesMap" | "devDependenciesRule"]: string | string[] | DependenciesType;
  },
  scriptInfo: {
    [k in FrameType | "Common"]: ScriptFnType
  },
  getIgnoreContent: (packageName: PackagesType | "Git") => string,
}

export function defineConfigPackage(config: fileInfoConfigType) {
  return config;
}

