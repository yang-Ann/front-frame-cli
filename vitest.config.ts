import { defineConfig, configDefaults, defaultExclude } from "vitest/config";

// https://cn.vitest.dev
export default defineConfig({
  test: {
    ...configDefaults,
    exclude: [
      ...defaultExclude,
      "**/assets/**",
    ],
  },
}); 