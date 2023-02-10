declare const createProject: (projectName: string, option: {
    preset: string;
}) => Promise<void>;
declare const logPersetConfigText: () => void;
declare const delPreset: (presetName: string) => void;
export { createProject, delPreset, logPersetConfigText };
