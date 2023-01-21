import { expect, test, describe } from "vitest";
import {
  nativePackageInstance,
  reactPackageInstance,
  vuePackageInstance
} from "./const.js";

describe("parseAllDependencies", () => {
  test("Vue", () => {
    expect(vuePackageInstance.parseAllDependencies()).toMatchSnapshot("Vue 依赖");
  });

  test("React", () => {
    expect(reactPackageInstance.parseAllDependencies()).toMatchSnapshot("React 依赖");
  });

  test("Native", () => {
    expect(nativePackageInstance.parseAllDependencies()).toMatchSnapshot("Native 依赖");
  });
});

test("isChild", () => {
  const obj = {
    Eslint: {
      // ...
    }
  };

  expect(vuePackageInstance.isChild(obj)).toBe(true);
});

describe("parseDependencies", () => {
  test("Vue", () => {
    expect(vuePackageInstance.parseDependencies()).toMatchSnapshot("Vue 解析依赖");
  });

  test("React", () => {
    expect(reactPackageInstance.parseDependencies()).toMatchSnapshot("React 解析依赖");
  });

  test("Native", () => {
    expect(nativePackageInstance.parseDependencies()).toMatchSnapshot("Native 解析依赖");
  });
});


describe("parseScripts", () => {
  test("Vue", () => {
    expect(vuePackageInstance.parseScripts()).toMatchSnapshot("Vue 命令");
  });

  test("React", () => {
    expect(reactPackageInstance.parseScripts()).toMatchSnapshot("React 命令");
  });

  test("Native", () => {
    expect(nativePackageInstance.parseScripts()).toMatchSnapshot("Native 命令");
  });
});