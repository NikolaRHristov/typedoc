"use strict";
var __addDisposableResource = (this && this.__addDisposableResource) || function (env, value, async) {
    if (value !== null && value !== void 0) {
        if (typeof value !== "object" && typeof value !== "function") throw new TypeError("Object expected.");
        var dispose, inner;
        if (async) {
            if (!Symbol.asyncDispose) throw new TypeError("Symbol.asyncDispose is not defined.");
            dispose = value[Symbol.asyncDispose];
        }
        if (dispose === void 0) {
            if (!Symbol.dispose) throw new TypeError("Symbol.dispose is not defined.");
            dispose = value[Symbol.dispose];
            if (async) inner = dispose;
        }
        if (typeof dispose !== "function") throw new TypeError("Object not disposable.");
        if (inner) dispose = function() { try { inner.call(this); } catch (e) { return Promise.reject(e); } };
        env.stack.push({ value: value, dispose: dispose, async: async });
    }
    else if (async) {
        env.stack.push({ async: true });
    }
    return value;
};
var __disposeResources = (this && this.__disposeResources) || (function (SuppressedError) {
    return function (env) {
        function fail(e) {
            env.error = env.hasError ? new SuppressedError(e, env.error, "An error was suppressed during disposal.") : e;
            env.hasError = true;
        }
        function next() {
            while (env.stack.length) {
                var rec = env.stack.pop();
                try {
                    var result = rec.dispose && rec.dispose.call(rec.value);
                    if (rec.async) return Promise.resolve(result).then(next, function(e) { fail(e); return next(); });
                }
                catch (e) {
                    fail(e);
                }
            }
            if (env.hasError) throw env.error;
        }
        return next();
    };
})(typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
});
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = require("assert");
const path_1 = require("path");
const utils_1 = require("../lib/utils");
const package_manifest_1 = require("../lib/utils/package-manifest");
const fs_fixture_builder_1 = require("@typestrong/fs-fixture-builder");
const TestLogger_1 = require("./TestLogger");
const paths_1 = require("../lib/utils/paths");
describe("Packages support", () => {
    const env_1 = { stack: [], error: void 0, hasError: false };
    try {
        const project = __addDisposableResource(env_1, (0, fs_fixture_builder_1.tempdirProject)(), false);
        afterEach(() => {
            project.rm();
        });
        it("handles monorepos", () => {
            project.addJsonFile("tsconfig.json", {
                compilerOptions: {
                    strict: true,
                    sourceMap: true,
                },
                exclude: ["node_modules", "dist"],
            });
            const childTsconfig = {
                extends: "../../tsconfig.json",
                compilerOptions: {
                    outDir: "dist",
                },
            };
            project.addJsonFile("package.json", {
                name: "typedoc-multi-package-example",
                main: "dist/index.js",
                workspaces: ["packages/*"],
            });
            // Bar, types entry point
            project.addFile("packages/bar/index.d.ts", "export function bar(): void;");
            project.addJsonFile("packages/bar/package.json", {
                name: "typedoc-multi-package-bar",
                version: "1.0.0",
                types: "index.d.ts",
            });
            project.addJsonFile("packages/bar/tsconfig.json", childTsconfig);
            // Baz, TypeScript "main" entry point
            project.addFile("packages/baz/index.ts", "export function baz(): {}");
            project.addJsonFile("packages/baz/package.json", {
                name: "typedoc-multi-package-baz",
                version: "1.0.0",
                main: "index.ts",
            });
            project.addJsonFile("packages/baz/tsconfig.json", childTsconfig);
            // Bay, entry point with "typedoc.entryPoint"
            project.addFile("packages/bay/dist/index.js", "module.exports = 123");
            project.addFile("packages/bay/index.ts", "export function foo() {}");
            project.addJsonFile("packages/bay/package.json", {
                name: "typedoc-multi-package-bay",
                version: "1.0.0",
                main: "dist/index",
                typedoc: {
                    entryPoint: "index.ts",
                },
            });
            project.addJsonFile("packages/bay/tsconfig.json", childTsconfig);
            // Ign, ignored package
            project.addFile("packages/ign/dist/index.js", "module.exports = 123");
            project.addFile("packages/ign/index.ts", "export function ign() {}");
            project.addJsonFile("packages/ign/package.json", {
                name: "typedoc-multi-package-ign",
                version: "1.0.0",
                main: "dist/index",
            });
            project.addJsonFile("packages/ign/tsconfig.json", childTsconfig);
            project.write();
            const logger = new TestLogger_1.TestLogger();
            const packages = (0, package_manifest_1.expandPackages)(logger, project.cwd, [project.cwd], (0, paths_1.createMinimatch)(["**/ign"]));
            (0, assert_1.deepStrictEqual)(packages, [
                (0, path_1.join)(project.cwd, "packages/bar"),
                (0, path_1.join)(project.cwd, "packages/bay"),
                (0, path_1.join)(project.cwd, "packages/baz"),
            ].map(utils_1.normalizePath));
            logger.expectNoOtherMessages();
        });
        it("handles single packages", () => {
            project.addJsonFile("tsconfig.json", {
                compilerOptions: {
                    outDir: "dist",
                    sourceMap: true,
                    strict: true,
                },
                include: ["src"],
            });
            project.addJsonFile("package.json", {
                name: "typedoc-single-package",
                main: "dist/index.js",
            });
            project.addFile("dist/index.js", `//# sourceMappingURL=index.js.map`);
            project.addJsonFile("dist/index.js.map", {
                version: 3,
                file: "index.js",
                sourceRoot: "",
                sources: ["../src/index.ts"],
                names: [],
                mappings: "",
            });
            project.addFile("src/index.ts", `export function helloWorld() { return "Hello World!"; }`);
            project.write();
            const logger = new TestLogger_1.TestLogger();
            const packages = (0, package_manifest_1.expandPackages)(logger, project.cwd, [project.cwd], []);
            logger.expectNoOtherMessages();
            (0, assert_1.deepStrictEqual)(packages, [(0, utils_1.normalizePath)(project.cwd)]);
        });
        it("Handles TS 4.7 extensions", () => {
            project.addJsonFile("tsconfig.json", {
                compilerOptions: {
                    outDir: "dist",
                    sourceMap: true,
                    strict: true,
                },
                include: ["src"],
            });
            project.addJsonFile("package.json", {
                name: "typedoc-single-package",
                main: "dist/index.cjs",
            });
            project.addFile("dist/index.cjs", `//# sourceMappingURL=index.cjs.map`);
            project.addJsonFile("dist/index.cjs.map", {
                version: 3,
                file: "index.cjs",
                sourceRoot: "",
                sources: ["../src/index.cts"],
                names: [],
                mappings: "",
            });
            project.addFile("src/index.cts", `export function helloWorld() { return "Hello World!"; }`);
            project.write();
            const logger = new TestLogger_1.TestLogger();
            const packages = (0, package_manifest_1.expandPackages)(logger, project.cwd, [project.cwd], []);
            logger.expectNoOtherMessages();
            (0, assert_1.deepStrictEqual)(packages, [(0, utils_1.normalizePath)(project.cwd)]);
        });
    }
    catch (e_1) {
        env_1.error = e_1;
        env_1.hasError = true;
    }
    finally {
        __disposeResources(env_1);
    }
});
//# sourceMappingURL=packages.test.js.map