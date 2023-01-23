import { EOL } from "node:os";
import { defineConfigPackage } from "../types/defineConfig.js";
// 管理 package.json 的 依赖 和 命令
const config = defineConfigPackage({
    // 所有依赖信息
    devDependenciesInfo: {
        // 打包工具
        buildTool: "Vite",
        // Vue 依赖
        Vue: {
            // 必须依赖
            dependencies: { "vue": "^3.2.45" },
            /** 可选依赖项
             * 键需要对应 {@link PackagesType} 类型
             */
            Packages: {
                // 打包工具依赖
                Vite: {
                    "vite": "^4.0.0",
                    "@vitejs/plugin-vue": "^4.0.0",
                    "unplugin-auto-import": "^0.12.1",
                    "unplugin-vue-components": "^0.22.12",
                },
                // 语言依赖
                TypeScript: { "vue-tsc": "^1.0.11" },
                "Element-Plus": { "element-plus": "^2.2.27" },
                "Vue-router": { "vue-router": "^4.1.6" },
                "JSX(TSX)": { "@vitejs/plugin-vue-jsx": "^3.0.0" },
                Pinia: { "pinia": "^2.0.28" },
                Vueuse: { "@vueuse/core": "^9.10.0", }
            },
        },
        // React 依赖
        React: {
            dependencies: {
                "react": "^18.2.0",
                "react-dom": "^18.2.0",
            },
            Packages: {
                Vite: {
                    "vite": "^4.0.0",
                    "@vitejs/plugin-react": "^3.0.0"
                },
                TypeScript: {
                    "@types/react": "^18.0.26",
                    "@types/react-dom": "^18.0.9",
                },
                "Ant-Design": { "antd": "^5.1.2" },
                "React-router": { "react-router-dom": "^6.6.1" },
                "React-use": { "react-use": "^17.4.0" },
                Reducx: {
                    "@reduxjs/toolkit": "^1.9.1",
                    "react-redux": "^8.0.5",
                },
            },
        },
        // 原生依赖
        Native: {
            dependencies: { "nodemon": "^2.0.20" },
            Packages: {
                TypeScript: { "ts-node": "^10.9.1" },
                Vitest: { "vitest": "^0.26.3" },
                Rollup: {
                    dependencies: {
                        "rollup": "^2.79.1",
                        "@rollup/plugin-babel": "^5.3.1",
                        "@rollup/plugin-commonjs": "^22.0.2",
                        "@rollup/plugin-replace": "^4.0.0",
                        "@rollup/plugin-terser": "^0.3.0",
                        "@babel/core": "^7.19.1",
                        "@babel/preset-env": "^7.19.4",
                    },
                    TypeScript: {
                        "@rollup/plugin-typescript": "^8.5.0",
                        "ts-node": "^10.9.1",
                        "tslib": "^2.4.0",
                    }
                },
                Commander: { "commander": "^9.4.0" },
                Inquirer: {
                    dependencies: { "inquirer": "^9.1.2" },
                    TypeScript: { "@types/inquirer": "^9.0.1" }
                },
                Ora: { "ora": "^6.1.2" },
                Chalk: { "chalk": "^5.0.1" },
                "Log-symbols": { "log-symbols": "^5.1.0" },
                "Fs-extra": {
                    dependencies: { "fs-extra": "^10.1.0" },
                    TypeScript: { "@types/fs-extra": "^11.0.1" }
                },
                "Puppeteer-core": { "puppeteer-core": "^19.5.2" },
            }
        },
        /** 通用依赖
         * 键需要对应 {@link PackagesType} 类型
         */
        Common: {
            Packages: {
                Axios: { "axios": "^1.2.1" },
                Dayjs: { "dayjs": "^1.11.7" },
                Prettier: { "prettier": "^2.7.1" },
                Sass: { "sass": "^1.57.1" },
                Lodash: {
                    dependencies: { "lodash": "^4.17.21" },
                    TypeScript: { "@types/lodash": "^4.14.191" }
                },
                TypeScript: {
                    "typescript": "^4.9.3",
                    "@types/node": "^18.11.18",
                },
                Eslint: {
                    // 必须依赖
                    dependencies: { "eslint": "^8.25.0" },
                    Vue: { "eslint-plugin-vue": "^9.8.0" },
                    React: { "eslint-plugin-react": "^7.31.11" },
                    // 通用依赖
                    Common: {
                        TypeScript: {
                            "@typescript-eslint/eslint-plugin": "^5.47.1",
                            "@typescript-eslint/parser": "^5.47.1",
                        }
                    }
                },
                Husky: {
                    "husky": "^8.0.3",
                },
                Commitlint: {
                    "@commitlint/cli": "^17.4.2",
                    "@commitlint/config-conventional": "^17.4.2",
                    "husky": "^8.0.3", // TODO 重复
                },
                "Tailwind CSS": {
                    "autoprefixer": "^10.4.13",
                    "postcss": "^8.4.21",
                    "tailwindcss": "^3.2.4",
                },
            }
        },
        // 指定开发依赖(其他都是生产依赖, 除了 @types, 等常见格式的都是开发依赖 )
        devDependenciesMap: [
            // Vue
            "vue-tsc",
            // React
            // Native
            "nodemon",
            "vitest",
            "ts-node",
            "tslib",
            "ora",
            "log-symbols",
            // Common
            "vite",
            "typescript",
            "autoprefixer",
            "postcss",
            "tailwindcss",
            "husky",
        ],
        // 开发依赖匹配规则, 匹配逻辑 `包名.indexOf(规则x) !== -1`
        devDependenciesRule: [
            "@types",
            "@vitejs",
            "babel",
            "rollup",
            "eslint",
            "prettier",
            "plugin",
            "@commitlint"
        ]
    },
    /** 所有命令配置
    *   键需要对应 {@link FrameType} 类型
    */
    scriptInfo: {
        Vue: {
            dev: "vite",
            build: (lang) => {
                let result = "vue-tsc && vite build";
                if (lang === "JavaScript") {
                    result = result.split(" && ")[1];
                }
                return result;
            },
            preview: "vite preview",
        },
        React: {
            dev: "vite",
            build: (lang) => {
                let result = "tsc && vite build";
                if (lang === "JavaScript") {
                    result = result.split(" && ")[1];
                }
                return result;
            },
            preview: "vite preview",
        },
        Native: {
            dev: (lang) => {
                let result = "node --loader ts-node/esm ./src/index.ts";
                if (lang === "JavaScript") {
                    result = "node ./src/index.js";
                }
                return result;
            },
            "dev:nodemon": "nodemon --watch ./dist ./dist/index.js",
        },
        /**
         * 键需要对应 {@link PackagesType} 类型
         */
        Common: {
            Prettier: {
                "prettier": "prettier --write src",
            },
            Vitest: {
                "test": "vitest"
            },
            Eslint: {
                "eslint": (lang, frame) => {
                    let result = "eslint src --ext .ts,.tsx"; // .js,.jsx,.vue
                    if (lang === "JavaScript") {
                        result = result.replace(/.ts/g, ".js");
                    }
                    if (frame === "Vue") {
                        result = result.replace(/.tsx|.jsx/g, ".vue");
                    }
                    else if (frame === "Native") {
                        result = result.split(",")[0];
                    }
                    return result;
                }
            },
            Rollup: {
                "build": (lang) => {
                    let result = "rollup -c ./rollup.config.ts";
                    if (lang === "JavaScript") {
                        result = result.replace(".ts", ".js");
                    }
                    return result;
                }
            },
            "Puppeteer-core": {
                "puppeteer": (lang) => {
                    let result = "node --loader ts-node/esm ./src/Puppeteer-core/index.ts";
                    if (lang === "JavaScript") {
                        result = "node ./src/Puppeteer-core/index.js";
                    }
                    return result;
                }
            }
        }
    },
    // ignore 文件内容
    getIgnoreContent(packageName) {
        const result = ["node_modules", "dist", "dist-ssr"];
        switch (packageName) {
            case "Prettier":
                result.push("test", "**/*/*.test.ts");
                break;
            case "Eslint":
                result.push("test", "**/*/*.test.ts");
                break;
            case "Git":
                result.push("*.exe", ".vscode/*");
                break;
            default:
                console.log("未知的类型 -> ", packageName);
                break;
        }
        return result.join(EOL);
    }
});
// 解构并暴露
export const { devDependenciesInfo, scriptInfo, getIgnoreContent } = config;
