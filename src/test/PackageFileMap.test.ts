import { test, expect, describe } from "vitest";
import { resolve } from "node:path";

import PackageFileMap from "../PackageFileMap.js";
import {
  getDirname
} from "../utils/exports.js";

import {
  nativePackageInstance,
  reactPackageInstance,
  vuePackageInstance
} from "./const.js";

// 测试目录
const testDir = resolve(getDirname(import.meta.url));
const projectName = "C:\\project";

// 目录位置不准确
describe("getSelectPackages", () => {
  test("Vue", () => {
    const instance = new PackageFileMap(
      projectName,
      vuePackageInstance.language,
      vuePackageInstance.frame,
      vuePackageInstance.packages
    );
    expect(
      replaceSEP(instance.getSelectPackages(testDir))
    ).toMatchSnapshot("Vue 依赖映射");
  });


  test("React", () => {
    const instance = new PackageFileMap(
      projectName,
      reactPackageInstance.language,
      reactPackageInstance.frame,
      reactPackageInstance.packages
    );
    expect(
      replaceSEP(instance.getSelectPackages(testDir))
    ).toMatchSnapshot("React 依赖映射");
  });

  test("Native", () => {
    const instance = new PackageFileMap(
      projectName,
      nativePackageInstance.language,
      nativePackageInstance.frame,
      nativePackageInstance.packages
    );
    expect(
      replaceSEP(instance.getSelectPackages(testDir))
    ).toMatchSnapshot("Native 依赖映射");
  });
});


function replaceSEP(list: PackageFileMapType[]): PackageFileMapType[] {
  const RE = /\\/g;
  list.forEach(e => {
    e.from = e.from.replace(RE, "/");
    e.to = e.to.replace(RE, "/");
  });
  return list;
}