declare const optionDir: string;
declare const presetPath: string;
declare const createOptionDir: () => string;
declare const getPresetConfig: () => Record<string, TemplateParamsType>;
declare const getPersetConfigText: () => PersetConfigTextType[];
declare const setPresetConfig: (key: string, value: TemplateParamsType) => void;
declare const delPresetConfig: (key: string) => boolean;
export { optionDir, presetPath, createOptionDir, getPresetConfig, getPersetConfigText, setPresetConfig, delPresetConfig, };
