declare const createOptionDir: () => string;
declare const getPresetConfig: () => Record<string, TemplateParamsType>;
declare const getPersetConfigText: () => PersetConfigTextType[];
declare const logPersetConfigText: () => void;
declare const setPresetConfig: (key: string, value: TemplateParamsType) => void;
declare const delPresetConfig: (key: string) => boolean;
export { createOptionDir, getPresetConfig, getPersetConfigText, logPersetConfigText, setPresetConfig, delPresetConfig, };
