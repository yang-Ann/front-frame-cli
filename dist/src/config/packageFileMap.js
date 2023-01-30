import { getExtByLang } from "../utils/exports.js";
import { defineConfigPackageFileMap } from "../types/defineConfig.js";
export default defineConfigPackageFileMap({
    // packages 文件映射(用于删除对应包的示例文件)
    fileMap: {
        /**
         * 键需要对应 {@link FrameType} 类型
         */
        Vue: {
            // 包名对应的示例文件地址, 会复制对应的文件到指定的路径
            "Pinia": [
                /**
                 * from 表示模板源文件所在位置可以是指定的 (`/dist/src/template/${frame}/packages/xxx`) 或者是公共的 (`/dist/src/template/common/packages/xxx`)
                 * to 表示在项目的位置
                 *  字符串会自动拼接 (`${projectDir}/${to}/${from}`)
                 *  函数则会调用使用其返回值
                 * */
                { from: "store", to: "src" },
                { from: "pinia.svg", to: "src/assets" },
                { from: "TestPinia.ejs", to: "src/components" },
            ],
            "Vue-router": [
                { from: "router", to: "src" },
                { from: "RouterView.ejs", to: "src/components" },
                { from: "NotFound.ejs", to: "src/components" },
            ],
            "JSX(TSX)": [
                {
                    from: "TestTsx.ejs",
                    to: "src/components",
                }
            ],
        },
        React: {
            "Reducx": [
                { from: "store", to: "src" },
                { from: "react-redux.svg", to: "src/assets" },
                { from: "TestRedux.ejs", to: "src/components" },
            ],
            "React-router": [
                { from: "router", to: "src" },
                { from: "NotFound.ejs", to: "src/components" },
                { from: "Router.ejs", to: "src/components" },
            ],
        },
        Native: {
            "Rollup": [
                ".babelrc",
                ".babelignore",
                "rollup.config.ejs"
            ],
            "Vitest": [
                "vitest.config.ejs",
                {
                    from: "test/index.test.ts",
                    to: lang => `src/test/index.test${getExtByLang(lang)}`
                },
            ],
            "Puppeteer-core": [
                { from: "", to: "src" }
            ],
            "Playwright": [
                "playwright.config.ejs",
                { from: "tests", to: "src" },
            ]
        },
        // 通用包文件映射
        commonPackageMap: {
            Axios: [
                { from: "request", to: "src" }
            ],
            Prettier: [
                ".prettierrc.cjs",
                ".prettierignore"
            ],
            Eslint: [
                ".eslintrc.ejs",
                ".eslintignore"
            ],
            Husky: [".husky"],
            // TODO 重复
            Commitlint: [
                "commitlint.config.cjs",
                ".husky"
            ],
            "Tailwind CSS": [
                "tailwind.config.cjs",
                "postcss.config.cjs"
            ],
        },
    }
});
