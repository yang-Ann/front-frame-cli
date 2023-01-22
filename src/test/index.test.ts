// https://cn.vitest.dev/guide/
import { test, expect, describe } from "vitest";
import { resolve } from "node:path";
import {
  objKeySort,
  strAsAscll,
  getExtByLang,
  walkdirOpator,
  isChildObject,
} from "../utils/exports.js";
import pkg from "../../package.json";
import { getPackagesOptionByFrame } from "../config/command.js";

describe("utils", () => {
  test("strAsAscll", async () => {
    const res = await strAsAscll(pkg.name);
    expect(res).toMatchSnapshot("打印 ASCLL");
  }, 3000);

  test("getExtByLang", () => {
    expect(getExtByLang("JavaScript")).toMatchInlineSnapshot('".js"');
    expect(getExtByLang("JavaScript", true)).toMatchInlineSnapshot('".jsx"');

    expect(getExtByLang("TypeScript")).toMatchInlineSnapshot('".ts"');
    expect(getExtByLang("TypeScript", true)).toMatchInlineSnapshot('".tsx"');
  });

  test("walkdirOpator", async () => {
    const path = resolve(__dirname, "../../assets/template/Vue/TypeScript");
    const RE = /\\/g;
    const files = await walkdirOpator(path, p => {
      return p.endsWith(".ejs") ? p.replace(RE, "/") : false;
    });
    expect(files).toMatchSnapshot("walkdirOpator 读取 ejs 文件信息");
  });

  test("isChildObject", () => {
    const obj = {
      Eslint: {
        // ...
      }
    };

    expect(isChildObject(obj)).toMatchInlineSnapshot('true');
  });
});


describe("config", () => {

  test("objKeySort", () => {
    const obj = {
      a: "1",
      c: "2",
      b: "3",
      "@types/node": "4"
    }

    expect(objKeySort(obj, "ASC")).toMatchInlineSnapshot(`
      {
        "@types/node": "4",
        "a": "1",
        "b": "3",
        "c": "2",
      }
    `);
  });


  test("getPackagesOptionByFrame", () => {
    expect(getPackagesOptionByFrame("Vue")).toMatchSnapshot("Vue 可选依赖");

    expect(getPackagesOptionByFrame("React")).toMatchSnapshot("React 可选依赖");

    expect(getPackagesOptionByFrame("Native")).toMatchSnapshot("Native 可选依赖");
  });
});