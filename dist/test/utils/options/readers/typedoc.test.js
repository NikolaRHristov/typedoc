"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = require("assert");
const fs_fixture_builder_1 = require("@typestrong/fs-fixture-builder");
const readers_1 = require("../../../../lib/utils/options/readers");
const utils_1 = require("../../../../lib/utils");
const TestLogger_1 = require("../../../TestLogger");
const path_1 = require("path");
const internationalization_1 = require("../../../../lib/internationalization/internationalization");
describe("Options - TypeDocReader", () => {
    const options = new utils_1.Options(new internationalization_1.Internationalization(null).proxy);
    options.addReader(new readers_1.TypeDocReader());
    it("Supports comments in json", async () => {
        const project = (0, fs_fixture_builder_1.project)("jsonc");
        after(() => project.rm());
        project.addFile("typedoc.json", '//comment\n{"name": "comment"}');
        const logger = new TestLogger_1.TestLogger();
        project.write();
        options.reset();
        options.setValue("options", project.cwd);
        await options.read(logger);
        logger.expectNoOtherMessages();
        (0, assert_1.deepStrictEqual)(options.getValue("name"), "comment");
    });
    it("Supports extends", async () => {
        const project = (0, fs_fixture_builder_1.project)("extends");
        project.addJsonFile("typedoc.json", {
            extends: "./other.json",
            name: "extends",
        });
        project.addJsonFile("other.json", {
            gitRevision: "master",
        });
        const logger = new TestLogger_1.TestLogger();
        project.write();
        after(() => project.rm());
        options.reset();
        options.setValue("options", project.cwd);
        await options.read(logger);
        logger.expectNoOtherMessages();
        (0, assert_1.deepStrictEqual)(options.getValue("name"), "extends");
        (0, assert_1.deepStrictEqual)(options.getValue("gitRevision"), "master");
    });
    it("Supports js files", async () => {
        const project = (0, fs_fixture_builder_1.project)("js");
        project.addFile("typedoc.js", "module.exports = { name: 'js' }");
        const logger = new TestLogger_1.TestLogger();
        project.write();
        after(() => project.rm());
        options.reset();
        options.setValue("options", project.cwd);
        await options.read(logger);
        logger.expectNoOtherMessages();
        (0, assert_1.deepStrictEqual)(options.getValue("name"), "js");
    });
    it("Errors if the file cannot be found", async () => {
        options.reset();
        options.setValue("options", "./non-existent-file.json");
        const logger = new TestLogger_1.TestLogger();
        await options.read(logger);
        logger.expectMessage("error: The options file */non-existent-file.json does not exist");
        logger.expectNoOtherMessages();
    });
    function testError(name, file, message, json = true) {
        it(name, async () => {
            const optionsFile = json ? "typedoc.json" : "typedoc.js";
            const project = (0, fs_fixture_builder_1.project)(name.replace(/ /g, "_"));
            if (typeof file === "string") {
                project.addFile(optionsFile, file);
            }
            else {
                project.addJsonFile(optionsFile, file);
            }
            options.reset();
            options.setValue("options", project.cwd);
            const logger = new TestLogger_1.TestLogger();
            project.write();
            after(() => project.rm());
            await options.read(logger);
            logger.expectMessage(message);
        });
    }
    testError("Errors if the data is invalid", "Not valid json {}", "error: Failed to parse */typedoc.json, ensure it exists and exports an object");
    testError("Errors if the data is not an object in a json file", 123, "error: Failed to parse */typedoc.json, ensure it exists and exports an object");
    testError("Errors if the data is not an object in a js file", "module.exports = 123", "error: Failed to parse */typedoc.js, ensure it exists and exports an object", false);
    testError("Errors if any set option errors", {
        someOptionThatDoesNotExist: true,
    }, "error: Unknown option 'someOptionThatDoesNotExist' You may have meant:*");
    testError("Errors if extends results in a loop", {
        extends: "./typedoc.json",
    }, 'error: Circular reference encountered for "extends" field of *');
    testError("Errors if the extended path cannot be found", {
        extends: "typedoc/nope",
    }, "error: Failed to resolve typedoc/nope to a file in */typedoc.json");
    it("Does not error if the option file cannot be found but was not set.", async () => {
        const options = new (class LyingOptions extends utils_1.Options {
            isSet() {
                return false;
            }
        })(new internationalization_1.Internationalization(null).proxy);
        options.addReader(new readers_1.TypeDocReader());
        const logger = new utils_1.Logger();
        await options.read(logger);
        (0, assert_1.deepStrictEqual)(logger.hasErrors(), false);
    });
    it("Handles ESM config files", async () => {
        const project = (0, fs_fixture_builder_1.project)("esm-config");
        project.addFile("typedoc.config.mjs", "export default { pretty: false }");
        project.write();
        after(() => project.rm());
        const logger = new TestLogger_1.TestLogger();
        const options = new utils_1.Options(new internationalization_1.Internationalization(null).proxy);
        options.setValue("options", (0, path_1.join)(project.cwd, "typedoc.config.mjs"));
        options.addReader(new readers_1.TypeDocReader());
        await options.read(logger);
        (0, assert_1.deepStrictEqual)(logger.hasErrors(), false);
    });
    it("Handles errors when reading config files", async () => {
        const project = (0, fs_fixture_builder_1.project)("errors");
        project.addFile("typedoc.config.mjs", "throw new Error('hi')");
        project.write();
        after(() => project.rm());
        const logger = new TestLogger_1.TestLogger();
        const options = new utils_1.Options(new internationalization_1.Internationalization(null).proxy);
        options.setValue("options", (0, path_1.join)(project.cwd, "typedoc.config.mjs"));
        options.addReader(new readers_1.TypeDocReader());
        await options.read(logger);
        logger.expectMessage("error: Failed to parse */typedoc.config.mjs, ensure it exists and exports an object");
        logger.expectMessage("error: hi");
    });
    it("Handles non-Error throws when reading config files", async () => {
        const project = (0, fs_fixture_builder_1.project)("errors2");
        project.addFile("typedoc.config.cjs", "throw 123");
        project.write();
        after(() => project.rm());
        const logger = new TestLogger_1.TestLogger();
        const options = new utils_1.Options(new internationalization_1.Internationalization(null).proxy);
        options.setValue("options", (0, path_1.join)(project.cwd, "typedoc.config.cjs"));
        options.addReader(new readers_1.TypeDocReader());
        await options.read(logger);
        logger.expectMessage("error: Failed to parse */typedoc.config.cjs, ensure it exists and exports an object");
        logger.expectMessage("error: 123");
    });
});
//# sourceMappingURL=typedoc.test.js.map