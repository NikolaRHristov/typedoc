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
const path_1 = require("path");
const assert_1 = require("assert");
const readers_1 = require("../../../../lib/utils/options/readers");
const utils_1 = require("../../../../lib/utils");
const TestLogger_1 = require("../../../TestLogger");
const fs_fixture_builder_1 = require("@typestrong/fs-fixture-builder");
const os_1 = require("os");
const internationalization_1 = require("../../../../lib/internationalization/internationalization");
describe("Options - TSConfigReader", () => {
    const options = new utils_1.Options(new internationalization_1.Internationalization(null).proxy);
    options.addReader(new readers_1.TSConfigReader());
    const logger = new TestLogger_1.TestLogger();
    async function readWithProject(project, reset = true, noErrors = true) {
        if (reset) {
            options.reset();
        }
        logger.reset();
        options.setValue("tsconfig", project.cwd);
        project.addFile("temp.ts", "export {}");
        project.write();
        await options.read(logger);
        if (noErrors) {
            logger.expectNoOtherMessages();
        }
    }
    it("Errors if the file cannot be found", async () => {
        options.reset();
        logger.reset();
        options.setValue("tsconfig", (0, path_1.join)((0, os_1.tmpdir)(), "typedoc/does-not-exist.json"));
        await options.read(logger);
        logger.expectMessage("error: *");
    });
    function testError(name, file) {
        it(name, async () => {
            const env_1 = { stack: [], error: void 0, hasError: false };
            try {
                const project = __addDisposableResource(env_1, (0, fs_fixture_builder_1.tempdirProject)(), false);
                project.addJsonFile("tsconfig.json", file);
                await readWithProject(project, true, false);
                (0, assert_1.deepStrictEqual)(logger.hasErrors(), true, "No error was logged");
            }
            catch (e_1) {
                env_1.error = e_1;
                env_1.hasError = true;
            }
            finally {
                __disposeResources(env_1);
            }
        });
    }
    testError("Errors if the data is invalid", {
        typedocOptions: "Will cause an error",
    });
    testError("Errors if any set option errors", {
        typedocOptions: {
            someOptionThatDoesNotExist: true,
        },
    });
    testError("Errors if tsconfig tries to set options file", {
        typedocOptions: {
            options: "any",
        },
    });
    testError("Errors if tsconfig tries to set tsconfig file", {
        typedocOptions: {
            tsconfig: "any",
        },
    });
    it("Errors if a tsconfig file cannot be parsed", async () => {
        const env_2 = { stack: [], error: void 0, hasError: false };
        try {
            const project = __addDisposableResource(env_2, (0, fs_fixture_builder_1.tempdirProject)(), false);
            project.addFile("tsconfig.json", '{"test}');
            await readWithProject(project, true, false);
            logger.expectMessage("error: *");
        }
        catch (e_2) {
            env_2.error = e_2;
            env_2.hasError = true;
        }
        finally {
            __disposeResources(env_2);
        }
    });
    it("Does not error if the option file cannot be found but was not set.", async () => {
        const logger = new utils_1.Logger();
        const options = new (class LyingOptions extends utils_1.Options {
            isSet() {
                return false;
            }
        })(new internationalization_1.Internationalization(null).proxy);
        options.setValue("tsconfig", (0, path_1.join)(__dirname, "data/does_not_exist.json"));
        options.addReader(new readers_1.TSConfigReader());
        await options.read(logger);
        (0, assert_1.deepStrictEqual)(logger.hasErrors(), false);
    });
    it("Reads typedocOptions from extended tsconfig files", async () => {
        const env_3 = { stack: [], error: void 0, hasError: false };
        try {
            const project = __addDisposableResource(env_3, (0, fs_fixture_builder_1.tempdirProject)(), false);
            project.addFile("file.ts", "export const abc = 123");
            project.addJsonFile("tsconfig.json", {
                extends: ["./base.tsconfig.json"],
                files: ["./file.ts"],
                typedocOptions: { plugin: ["a"] },
            });
            project.addJsonFile("base.tsconfig.json", {
                typedocOptions: { name: "a", plugin: ["b"] },
            });
            await readWithProject(project);
            logger.expectNoOtherMessages();
            (0, assert_1.deepStrictEqual)(options.getValue("name"), "a");
            (0, assert_1.deepStrictEqual)(options.getValue("plugin"), ["a"]);
        }
        catch (e_3) {
            env_3.error = e_3;
            env_3.hasError = true;
        }
        finally {
            __disposeResources(env_3);
        }
    });
    async function readTsconfig(tsconfig) {
        const env_4 = { stack: [], error: void 0, hasError: false };
        try {
            const project = __addDisposableResource(env_4, (0, fs_fixture_builder_1.tempdirProject)(), false);
            project.addFile("file.ts", "export const abc = 123");
            project.addJsonFile("tsconfig.json", tsconfig);
            await readWithProject(project);
            logger.expectNoOtherMessages();
        }
        catch (e_4) {
            env_4.error = e_4;
            env_4.hasError = true;
        }
        finally {
            __disposeResources(env_4);
        }
    }
    it("Sets files for the program", async () => {
        await readTsconfig({
            files: ["./file.ts"],
        });
        (0, assert_1.deepStrictEqual)(options.getFileNames().map((f) => (0, path_1.basename)(f)), ["file.ts"]);
    });
    it("Allows stripInternal to set excludeInternal", async () => {
        await readTsconfig({
            compilerOptions: {
                stripInternal: true,
            },
        });
        (0, assert_1.deepStrictEqual)(options.getValue("excludeInternal"), true);
    });
    it("Does not set excludeInternal by stripInternal if already set", async () => {
        const env_5 = { stack: [], error: void 0, hasError: false };
        try {
            const project = __addDisposableResource(env_5, (0, fs_fixture_builder_1.tempdirProject)(), false);
            project.addJsonFile("tsconfig.json", {
                compilerOptions: { stripInternal: true },
            });
            options.reset();
            options.setValue("excludeInternal", false);
            await readWithProject(project, false);
            (0, assert_1.deepStrictEqual)(options.getValue("excludeInternal"), false);
        }
        catch (e_5) {
            env_5.error = e_5;
            env_5.hasError = true;
        }
        finally {
            __disposeResources(env_5);
        }
    });
    it("Correctly handles folder names ending with .json (#1712)", async () => {
        const env_6 = { stack: [], error: void 0, hasError: false };
        try {
            const project = __addDisposableResource(env_6, (0, fs_fixture_builder_1.tempdirProject)(), false);
            project.addJsonFile("tsconfig.json", {
                compilerOptions: { strict: true },
            });
            await readWithProject(project);
            (0, assert_1.deepStrictEqual)(options.getCompilerOptions().strict, true);
        }
        catch (e_6) {
            env_6.error = e_6;
            env_6.hasError = true;
        }
        finally {
            __disposeResources(env_6);
        }
    });
    async function testTsdoc(tsdoc, cb, reset = true) {
        const env_7 = { stack: [], error: void 0, hasError: false };
        try {
            const project = __addDisposableResource(env_7, (0, fs_fixture_builder_1.tempdirProject)(), false);
            project.addFile("file.ts", "export const abc = 123");
            project.addJsonFile("tsconfig.json", {});
            project.addJsonFile("tsdoc.json", tsdoc);
            await readWithProject(project, reset, false);
            cb?.();
            logger.expectNoOtherMessages();
        }
        catch (e_7) {
            env_7.error = e_7;
            env_7.hasError = true;
        }
        finally {
            __disposeResources(env_7);
        }
    }
    it("Handles failed tsdoc reads", async () => {
        await testTsdoc([], () => {
            logger.expectMessage("error: Failed to read tsdoc.json file at */tsdoc.json");
        });
    });
    it("Handles invalid tsdoc files", async () => {
        await testTsdoc({
            doesNotMatchSchema: true,
        }, () => {
            logger.expectMessage(`error: The file */tsdoc.json is not a valid tsdoc.json file`);
        });
    });
    it("Warns if an option will be overwritten", async () => {
        options.reset();
        options.setValue("blockTags", []);
        options.setValue("modifierTags", []);
        await testTsdoc({}, () => {
            logger.expectMessage("warn: The blockTags, modifierTags defined in typedoc.json " +
                "will be overwritten by configuration in tsdoc.json");
        }, false);
    });
    it("Reads tsdoc.json", async () => {
        await testTsdoc({
            noStandardTags: true,
            tagDefinitions: [
                {
                    tagName: "@tag",
                    syntaxKind: "block",
                },
                {
                    tagName: "@tag2",
                    syntaxKind: "inline",
                },
                {
                    tagName: "@tag3",
                    syntaxKind: "modifier",
                },
            ],
        });
        (0, assert_1.deepStrictEqual)(options.getValue("blockTags"), ["@tag"]);
        (0, assert_1.deepStrictEqual)(options.getValue("inlineTags"), ["@tag2"]);
        (0, assert_1.deepStrictEqual)(options.getValue("modifierTags"), ["@tag3"]);
    });
    it("Handles extends in tsdoc.json", async () => {
        const env_8 = { stack: [], error: void 0, hasError: false };
        try {
            const project = __addDisposableResource(env_8, (0, fs_fixture_builder_1.tempdirProject)(), false);
            project.addFile("file.ts", "export const abc = 123");
            project.addJsonFile("tsconfig.json", {});
            project.addJsonFile("tsdoc.json", { extends: ["./tsdoc2.json"] });
            project.addJsonFile("tsdoc2.json", {
                noStandardTags: true,
                tagDefinitions: [
                    {
                        tagName: "@tag",
                        syntaxKind: "block",
                    },
                ],
            });
            await readWithProject(project);
            (0, assert_1.deepStrictEqual)(options.getValue("blockTags"), ["@tag"]);
            logger.expectNoOtherMessages();
        }
        catch (e_8) {
            env_8.error = e_8;
            env_8.hasError = true;
        }
        finally {
            __disposeResources(env_8);
        }
    });
    it("Handles supportForTags in tsdoc.json", async () => {
        await testTsdoc({
            noStandardTags: true,
            tagDefinitions: [
                {
                    tagName: "@tag",
                    syntaxKind: "block",
                },
                {
                    tagName: "@tag2",
                    syntaxKind: "inline",
                },
                {
                    tagName: "@tag3",
                    syntaxKind: "modifier",
                },
            ],
            supportForTags: {
                "@tag": true,
            },
        });
        (0, assert_1.deepStrictEqual)(options.getValue("blockTags"), ["@tag"]);
        (0, assert_1.deepStrictEqual)(options.getValue("inlineTags"), []);
        (0, assert_1.deepStrictEqual)(options.getValue("modifierTags"), []);
    });
    it("Handles circular extends", async () => {
        await testTsdoc({
            extends: ["./tsdoc.json"],
        }, () => {
            logger.expectMessage('error: Circular reference encountered for "extends" field of */tsdoc.json');
        });
    });
    it("Handles extends which reference invalid files", async () => {
        await testTsdoc({
            extends: ["typedoc/nope"],
        }, () => {
            logger.expectMessage("error: Failed to resolve typedoc/nope to a file in */tsdoc.json");
        });
    });
});
