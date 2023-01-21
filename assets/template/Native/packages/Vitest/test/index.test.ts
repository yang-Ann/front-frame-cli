import { add, sayHi } from "../utils.js";
import { test, expect } from "vitest";

// vitest: https://cn.vitest.dev/guide/

test("add test", () => {
  expect(add(1, 2)).toBe(3);
});

test("sayHi test", () => {
  expect(sayHi()).toBe("hello world");
});

test("sayHi test", () => {
  expect(sayHi()).toMatchInlineSnapshot('"hello world"');
});
