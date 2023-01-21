import { test, expect, describe } from "vitest";
import PackageFileMap from "../PackageFileMap.js";
import { nativePackageInstance, reactPackageInstance, vuePackageInstance } from "./const.js";
describe("getSelectPackages", () => {
    test("Vue", () => {
        const instance = new PackageFileMap("C:\\project", vuePackageInstance.language, vuePackageInstance.frame, vuePackageInstance.packages);
        expect(replaceSEP(instance.getSelectPackages())).toMatchSnapshot("Vue 依赖映射");
    });
    test("React", () => {
        const instance = new PackageFileMap("C:\\project", reactPackageInstance.language, reactPackageInstance.frame, reactPackageInstance.packages);
        expect(replaceSEP(instance.getSelectPackages())).toMatchSnapshot("React 依赖映射");
    });
    test("Native", () => {
        const instance = new PackageFileMap("C:\\project", nativePackageInstance.language, nativePackageInstance.frame, nativePackageInstance.packages);
        expect(replaceSEP(instance.getSelectPackages())).toMatchSnapshot("Native 依赖映射");
    });
});
function replaceSEP(list) {
    const RE = /\\/g;
    list.forEach(e => {
        e.from = e.from.replace(RE, "/");
        e.to = e.to.replace(RE, "/");
    });
    return list;
}
