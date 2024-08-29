"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = require("assert");
const path_1 = require("path");
const internationalization_1 = require("../../../../lib/internationalization/internationalization");
const utils_1 = require("../../../../lib/utils");
const options_1 = require("../../../../lib/utils/options");
const readers_1 = require("../../../../lib/utils/options/readers");
const TestLogger_1 = require("../../../TestLogger");
const emptyHelp = () => "";
describe("Options - ArgumentsReader", () => {
    const logger = new TestLogger_1.TestLogger();
    afterEach(() => logger.reset());
    // Note: We lie about the type of Options here since we want the less strict
    // behavior for tests. If TypeDoc ever gets a numeric option, then we can
    // exclusively use the builtin options for tests and this cast can go away.
    let options;
    beforeEach(() => {
        options = new utils_1.Options(new internationalization_1.Internationalization(null).proxy);
        options.addDeclaration({
            name: "numOption",
            help: emptyHelp,
            type: options_1.ParameterType.Number,
        });
        options.addDeclaration({
            name: "mapped",
            type: options_1.ParameterType.Map,
            help: emptyHelp,
            map: { a: 1, b: 2 },
            defaultValue: 3,
        });
    });
    function test(name, args, cb) {
        it(name, async () => {
            const reader = new readers_1.ArgumentsReader(1, args);
            options.reset();
            options.addReader(reader);
            await options.read(logger);
            cb();
        });
    }
    test("Puts arguments with no flag into inputFiles", ["foo", "bar"], () => {
        (0, assert_1.deepStrictEqual)(options.getValue("entryPoints"), [
            (0, path_1.join)(process.cwd(), "foo"),
            (0, path_1.join)(process.cwd(), "bar"),
        ]);
    });
    test("Works with string options", ["--out", "outDir"], () => {
        (0, assert_1.deepStrictEqual)(options.getValue("out"), (0, path_1.join)(process.cwd(), "outDir"));
    });
    test("Works with number options", ["-numOption", "123"], () => {
        (0, assert_1.deepStrictEqual)(options.getValue("numOption"), 123);
    });
    test("Works with boolean options", ["--includeVersion"], () => {
        (0, assert_1.deepStrictEqual)(options.getValue("includeVersion"), true);
    });
    test("Allows setting boolean options with a value", ["--includeVersion", "TrUE"], () => {
        (0, assert_1.deepStrictEqual)(options.getValue("includeVersion"), true);
        (0, assert_1.deepStrictEqual)(options.getValue("entryPoints"), []);
    });
    test("Allows setting boolean options to false with a value", ["--includeVersion", "FALse"], () => {
        (0, assert_1.deepStrictEqual)(options.getValue("includeVersion"), false);
        (0, assert_1.deepStrictEqual)(options.getValue("entryPoints"), []);
    });
    test("Bool options do not improperly consume arguments", ["--includeVersion", "foo"], () => {
        (0, assert_1.deepStrictEqual)(options.getValue("includeVersion"), true);
        (0, assert_1.deepStrictEqual)(options.getValue("entryPoints"), [
            (0, path_1.join)(process.cwd(), "foo"),
        ]);
    });
    test("Works with map options", ["--mapped", "b"], () => {
        (0, assert_1.deepStrictEqual)(options.getValue("mapped"), 2);
    });
    test("Works with array options", ["--exclude", "a"], () => {
        (0, assert_1.deepStrictEqual)(options.getValue("exclude"), [(0, path_1.resolve)("a")]);
    });
    test("Works with array options passed multiple times", ["--exclude", "a", "--exclude", "b"], () => {
        (0, assert_1.deepStrictEqual)(options.getValue("exclude"), [(0, path_1.resolve)("a"), (0, path_1.resolve)("b")]);
    });
    it("Errors if given an unknown option", async () => {
        const similarOptions = options.getSimilarOptions("badOption");
        const reader = new readers_1.ArgumentsReader(1, ["--badOption"]);
        options.reset();
        options.addReader(reader);
        await options.read(logger);
        logger.expectMessage(`error: Unknown option: --badOption, you may have meant:\n\t${similarOptions.join("\n\t")}`);
    });
    it("Warns if option is expecting a value but no value is provided", async () => {
        const reader = new readers_1.ArgumentsReader(1, ["--out"]);
        options.reset();
        options.addReader(reader);
        const logger = new TestLogger_1.TestLogger();
        await options.read(logger);
        logger.expectMessage("warn: --out expected a value, but none was given as an argument");
        logger.expectNoOtherMessages();
    });
    test("Works with flag values without specifying a value", ["--validation.invalidLink"], () => {
        (0, assert_1.deepStrictEqual)(logger.hasErrors(), false);
        (0, assert_1.deepStrictEqual)(logger.hasWarnings(), false);
        (0, assert_1.deepStrictEqual)(options.getValue("validation"), {
            notExported: true,
            notDocumented: false,
            invalidLink: true,
        });
    });
    test("Works with flag values with specifying a value", [
        "--validation.invalidLink",
        "true",
        "--validation.notExported",
        "false",
    ], () => {
        (0, assert_1.deepStrictEqual)(logger.hasErrors(), false);
        (0, assert_1.deepStrictEqual)(logger.hasWarnings(), false);
        (0, assert_1.deepStrictEqual)(options.getValue("validation"), {
            notExported: false,
            notDocumented: false,
            invalidLink: true,
        });
    });
    test("Works with flag values without specifying a specific flag", ["--validation"], () => {
        (0, assert_1.deepStrictEqual)(logger.hasErrors(), false);
        (0, assert_1.deepStrictEqual)(logger.hasWarnings(), false);
        (0, assert_1.deepStrictEqual)(options.getValue("validation"), {
            notExported: true,
            notDocumented: true,
            invalidLink: true,
        });
    });
    test("Works with flag values without specifying a specific flag and setting true", ["--validation", "true"], () => {
        (0, assert_1.deepStrictEqual)(logger.hasErrors(), false);
        (0, assert_1.deepStrictEqual)(logger.hasWarnings(), false);
        (0, assert_1.deepStrictEqual)(options.getValue("validation"), {
            notExported: true,
            notDocumented: true,
            invalidLink: true,
        });
    });
    test("Works with flag values without specifying a specific flag and setting false", ["--validation", "false"], () => {
        (0, assert_1.deepStrictEqual)(logger.hasErrors(), false);
        (0, assert_1.deepStrictEqual)(logger.hasWarnings(), false);
        (0, assert_1.deepStrictEqual)(options.getValue("validation"), {
            notExported: false,
            notDocumented: false,
            invalidLink: false,
        });
    });
});
//# sourceMappingURL=arguments.test.js.map