type PackageListType = Array<{
    name: string;
    checked?: boolean;
}>;
declare const getPackagesOptionByFrame: (frame: FrameType) => PackageListType;
export declare const execCommandOption: {
    frame: ({
        name: string;
        checked: boolean;
    } | {
        name: string;
        checked?: undefined;
    })[];
    language: ({
        name: string;
        checked: boolean;
    } | {
        name: string;
        checked?: undefined;
    })[];
    packages: (frame: FrameType) => PackageListType;
};
export { getPackagesOptionByFrame };
