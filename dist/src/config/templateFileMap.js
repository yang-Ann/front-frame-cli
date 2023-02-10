import { getExtByLang } from "../utils/exports.js";
import { defineConfigTemplateFileMap } from "../types/defineConfig.js";
export default defineConfigTemplateFileMap({
    // ejs 文件映射(用于将 ejs模板文件转换为指定的文件)
    fileMap: {
        /**
         * 键需要对应 {@link FrameType} 类型
         */
        Vue: {
            /**
             * 键对应 ejs 文件路径, 省略.ejs后缀 (`${projectDir}/${键}.ejs`)
             * 值对应转换后的文件后缀名
             *  字符串则直接拼接 (`${projectDir}/${键}${值}`)
             *  函数则会调用取返回值 (`${projectDir}/${键}${fn(lang)}`)
             *  null 表示有 ejs 模板文件但是没有设置后缀名, 默认为 `{@link getExtByLang}`函数 (`${projectDir}/${键}${getExtByLang(lang)}`)
            */
            required: {
                "index": ".html",
                // "vite.config": null, // 可写可不写
                "src/App": ".vue",
                "src/components/Count": ".vue",
                "src/index": ".css",
            },
            "JSX(TSX)": {
                "src/components/TestTsx": lang => getExtByLang(lang, true),
            },
            Pinia: {
                "src/components/TestPinia": ".vue",
            },
            "Vue-router": {
                "src/components/RouterView": ".vue",
                "src/components/NotFound": ".vue",
            }
        },
        React: {
            required: {
                "index": ".html",
                "src/App": lang => getExtByLang(lang, true),
                "src/main": lang => getExtByLang(lang, true),
                "src/components/Count": lang => getExtByLang(lang, true),
                "src/index": ".css",
            },
            "React-router": {
                "src/router/index": lang => getExtByLang(lang, true),
                "src/components/NotFound": lang => getExtByLang(lang, true),
                "src/components/Router": lang => getExtByLang(lang, true),
            },
            Reducx: {
                "src/components/TestRedux": lang => getExtByLang(lang, true),
            },
        },
        Native: {},
        // 通用映射
        Common: {
            required: {
                "package": ".json",
            },
            Prettier: {
                ".prettierrc": ".cjs",
            },
            Eslint: {
                ".eslintrc": ".cjs",
            },
        },
    }
});
