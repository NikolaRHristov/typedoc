"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = require("assert");
const path_1 = require("path");
const declaration_1 = require("../../../lib/utils/options/declaration");
const internationalization_1 = require("../../../lib/internationalization/internationalization");
const emptyHelp = () => "";
describe("Options - conversions", () => {
    const i18n = new internationalization_1.Internationalization(null).proxy;
    const optionWithType = (type) => ({
        type,
        defaultValue: undefined,
        name: "test",
        help: emptyHelp,
    });
    it("Converts to numbers", () => {
        (0, assert_1.deepStrictEqual)((0, declaration_1.convert)("123", optionWithType(declaration_1.ParameterType.Number), i18n, ""), 123);
        (0, assert_1.deepStrictEqual)((0, declaration_1.convert)("a", optionWithType(declaration_1.ParameterType.Number), i18n, ""), 0);
        (0, assert_1.deepStrictEqual)((0, declaration_1.convert)(NaN, optionWithType(declaration_1.ParameterType.Number), i18n, ""), 0);
    });
    it("Converts to number if value is the lowest allowed value for a number option", () => {
        const declaration = {
            name: "test",
            help: emptyHelp,
            type: declaration_1.ParameterType.Number,
            minValue: 1,
            maxValue: 10,
            defaultValue: 1,
        };
        (0, assert_1.deepStrictEqual)((0, declaration_1.convert)(1, declaration, i18n, ""), 1);
    });
    it("Generates an error if value is too low for a number option", () => {
        const declaration = {
            name: "test",
            help: emptyHelp,
            type: declaration_1.ParameterType.Number,
            minValue: 1,
            maxValue: 10,
            defaultValue: 1,
        };
        (0, assert_1.throws)(() => (0, declaration_1.convert)(0, declaration, i18n, ""), new Error("test must be between 1 and 10"));
    });
    it("Generates an error if value is too low for a number option with no max", () => {
        const declaration = {
            name: "test",
            help: emptyHelp,
            type: declaration_1.ParameterType.Number,
            minValue: 1,
            defaultValue: 1,
        };
        (0, assert_1.throws)(() => (0, declaration_1.convert)(0, declaration, i18n, ""), new Error("test must be equal to or greater than 1"));
    });
    it("Generates an error if value is too high for a number option with no min", () => {
        const declaration = {
            name: "test",
            help: emptyHelp,
            type: declaration_1.ParameterType.Number,
            maxValue: 10,
            defaultValue: 1,
        };
        (0, assert_1.throws)(() => (0, declaration_1.convert)(11, declaration, i18n, ""), new Error("test must be less than or equal to 10"));
    });
    it("Converts to number if value is the highest allowed value for a number option", () => {
        const declaration = {
            name: "test",
            help: emptyHelp,
            type: declaration_1.ParameterType.Number,
            minValue: 1,
            maxValue: 10,
            defaultValue: 1,
        };
        (0, assert_1.deepStrictEqual)((0, declaration_1.convert)(10, declaration, i18n, ""), 10);
    });
    it("Generates an error if value is too high for a number option", () => {
        const declaration = {
            name: "test",
            help: emptyHelp,
            type: declaration_1.ParameterType.Number,
            minValue: 1,
            maxValue: 10,
            defaultValue: 1,
        };
        (0, assert_1.throws)(() => (0, declaration_1.convert)(11, declaration, i18n, ""), new Error("test must be between 1 and 10"));
    });
    it("Validates number options", () => {
        const declaration = {
            name: "test",
            help: emptyHelp,
            type: declaration_1.ParameterType.Number,
            validate: (value) => {
                if (value % 2 !== 0) {
                    throw new Error("test must be even");
                }
            },
        };
        (0, assert_1.deepStrictEqual)((0, declaration_1.convert)(0, declaration, i18n, ""), 0);
        (0, assert_1.deepStrictEqual)((0, declaration_1.convert)(2, declaration, i18n, ""), 2);
        (0, assert_1.deepStrictEqual)((0, declaration_1.convert)(4, declaration, i18n, ""), 4);
        (0, assert_1.throws)(() => (0, declaration_1.convert)(1, declaration, i18n, ""), new Error("test must be even"));
    });
    it("Converts to strings", () => {
        (0, assert_1.deepStrictEqual)((0, declaration_1.convert)("123", optionWithType(declaration_1.ParameterType.String), i18n, ""), "123");
        (0, assert_1.deepStrictEqual)((0, declaration_1.convert)(123, optionWithType(declaration_1.ParameterType.String), i18n, ""), "123");
        (0, assert_1.deepStrictEqual)((0, declaration_1.convert)(["1", "2"], optionWithType(declaration_1.ParameterType.String), i18n, ""), "1,2");
        (0, assert_1.deepStrictEqual)((0, declaration_1.convert)(null, optionWithType(declaration_1.ParameterType.String), i18n, ""), "");
        (0, assert_1.deepStrictEqual)((0, declaration_1.convert)(void 0, optionWithType(declaration_1.ParameterType.String), i18n, ""), "");
    });
    it("Validates string options", () => {
        const declaration = {
            name: "test",
            help: emptyHelp,
            type: declaration_1.ParameterType.String,
            validate: (value) => {
                if (value !== value.toUpperCase()) {
                    throw new Error("test must be upper case");
                }
            },
        };
        (0, assert_1.deepStrictEqual)((0, declaration_1.convert)("TOASTY", declaration, i18n, ""), "TOASTY");
        (0, assert_1.throws)(() => (0, declaration_1.convert)("toasty", declaration, i18n, ""), new Error("test must be upper case"));
    });
    it("Converts to booleans", () => {
        (0, assert_1.deepStrictEqual)((0, declaration_1.convert)("a", optionWithType(declaration_1.ParameterType.Boolean), i18n, ""), true);
        (0, assert_1.deepStrictEqual)((0, declaration_1.convert)([1], optionWithType(declaration_1.ParameterType.Boolean), i18n, ""), true);
        (0, assert_1.deepStrictEqual)((0, declaration_1.convert)(false, optionWithType(declaration_1.ParameterType.Boolean), i18n, ""), false);
    });
    it("Converts to arrays", () => {
        (0, assert_1.deepStrictEqual)((0, declaration_1.convert)("12,3", optionWithType(declaration_1.ParameterType.Array), i18n, ""), [
            "12,3",
        ]);
        (0, assert_1.deepStrictEqual)((0, declaration_1.convert)(["12,3"], optionWithType(declaration_1.ParameterType.Array), i18n, ""), ["12,3"]);
        (0, assert_1.deepStrictEqual)((0, declaration_1.convert)(true, optionWithType(declaration_1.ParameterType.Array), i18n, ""), []);
        (0, assert_1.deepStrictEqual)((0, declaration_1.convert)("/,a", optionWithType(declaration_1.ParameterType.PathArray), i18n, ""), [(0, path_1.resolve)("/,a")]);
        (0, assert_1.deepStrictEqual)((0, declaration_1.convert)(["/foo"], optionWithType(declaration_1.ParameterType.PathArray), i18n, ""), [(0, path_1.resolve)("/foo")]);
        (0, assert_1.deepStrictEqual)((0, declaration_1.convert)(true, optionWithType(declaration_1.ParameterType.PathArray), i18n, ""), []);
        (0, assert_1.deepStrictEqual)((0, declaration_1.convert)("a,b", optionWithType(declaration_1.ParameterType.ModuleArray), i18n, ""), ["a,b"]);
        (0, assert_1.deepStrictEqual)((0, declaration_1.convert)(["a,b"], optionWithType(declaration_1.ParameterType.ModuleArray), i18n, ""), ["a,b"]);
        (0, assert_1.deepStrictEqual)((0, declaration_1.convert)(true, optionWithType(declaration_1.ParameterType.ModuleArray), i18n, ""), []);
    });
    it("ModuleArray is resolved if relative", () => {
        (0, assert_1.deepStrictEqual)((0, declaration_1.convert)(["./foo"], optionWithType(declaration_1.ParameterType.ModuleArray), i18n, ""), [(0, path_1.join)(process.cwd(), "foo")]);
    });
    it("Validates array options", () => {
        const declaration = {
            name: "test",
            help: emptyHelp,
            type: declaration_1.ParameterType.Array,
            validate: (value) => {
                if (value.length === 0) {
                    throw new Error("test must not be empty");
                }
            },
        };
        (0, assert_1.deepStrictEqual)((0, declaration_1.convert)(["1"], declaration, i18n, ""), ["1"]);
        (0, assert_1.deepStrictEqual)((0, declaration_1.convert)(["1", "2"], declaration, i18n, ""), ["1", "2"]);
        (0, assert_1.throws)(() => (0, declaration_1.convert)([], declaration, i18n, ""), new Error("test must not be empty"));
    });
    it("Converts to mapped types", () => {
        const declaration = {
            name: "",
            help: emptyHelp,
            type: declaration_1.ParameterType.Map,
            map: {
                a: 1,
                b: 2,
            },
            defaultValue: 1,
        };
        (0, assert_1.deepStrictEqual)((0, declaration_1.convert)("a", declaration, i18n, ""), 1);
        (0, assert_1.deepStrictEqual)((0, declaration_1.convert)("b", declaration, i18n, ""), 2);
        (0, assert_1.deepStrictEqual)((0, declaration_1.convert)(2, declaration, i18n, ""), 2);
    });
    it("Converts to mapped types with a map", () => {
        const declaration = {
            name: "",
            help: emptyHelp,
            type: declaration_1.ParameterType.Map,
            map: new Map([
                ["a", 1],
                ["b", 2],
            ]),
            defaultValue: 1,
        };
        (0, assert_1.deepStrictEqual)((0, declaration_1.convert)("a", declaration, i18n, ""), 1);
        (0, assert_1.deepStrictEqual)((0, declaration_1.convert)("b", declaration, i18n, ""), 2);
        (0, assert_1.deepStrictEqual)((0, declaration_1.convert)(2, declaration, i18n, ""), 2);
    });
    it("Generates a nice error if value is invalid", () => {
        const declaration = {
            name: "test",
            help: emptyHelp,
            type: declaration_1.ParameterType.Map,
            map: new Map([
                ["a", 1],
                ["b", 2],
            ]),
            defaultValue: 1,
        };
        (0, assert_1.throws)(() => (0, declaration_1.convert)("c", declaration, i18n, ""), new Error("test must be one of a, b"));
    });
    it("Correctly handles enum types in the map error", () => {
        let Enum;
        (function (Enum) {
            Enum[Enum["a"] = 0] = "a";
            Enum[Enum["b"] = 1] = "b";
        })(Enum || (Enum = {}));
        const declaration = {
            name: "test",
            help: emptyHelp,
            type: declaration_1.ParameterType.Map,
            map: Enum,
            defaultValue: Enum.a,
        };
        (0, assert_1.throws)(() => (0, declaration_1.convert)("c", declaration, i18n, ""), new Error("test must be one of a, b"));
    });
    it("Passes through mixed", () => {
        const data = Symbol();
        (0, assert_1.deepStrictEqual)((0, declaration_1.convert)(data, optionWithType(declaration_1.ParameterType.Mixed), i18n, ""), data);
    });
    it("Validates mixed options", () => {
        const declaration = {
            name: "test",
            help: emptyHelp,
            type: declaration_1.ParameterType.Mixed,
            defaultValue: "default",
            validate: (value) => {
                if (typeof value === "number") {
                    throw new Error("test must not be a number");
                }
            },
        };
        (0, assert_1.deepStrictEqual)((0, declaration_1.convert)("text", declaration, i18n, ""), "text");
        (0, assert_1.throws)(() => (0, declaration_1.convert)(1, declaration, i18n, ""), new Error("test must not be a number"));
    });
    it("Passes through object", () => {
        const data = {};
        (0, assert_1.deepStrictEqual)((0, declaration_1.convert)(data, optionWithType(declaration_1.ParameterType.Object), i18n, ""), data);
    });
    it("Validates object options", () => {
        const declaration = {
            name: "test",
            help: emptyHelp,
            type: declaration_1.ParameterType.Object,
            defaultValue: "default",
            validate: (value) => {
                if (typeof value !== "object" || Array.isArray(value)) {
                    throw new Error("test must be an object");
                }
            },
        };
        (0, assert_1.deepStrictEqual)((0, declaration_1.convert)({}, declaration, i18n, ""), {});
        (0, assert_1.throws)(() => (0, declaration_1.convert)(1, declaration, i18n, ""), new Error("test must be an object"));
    });
    it("Converts object options", () => {
        const declaration = {
            name: "test",
            help: emptyHelp,
            type: declaration_1.ParameterType.Object,
            defaultValue: { a: 1, b: 2 },
        };
        (0, assert_1.deepStrictEqual)((0, declaration_1.convert)({ b: 3 }, declaration, i18n, "", declaration.defaultValue), {
            a: 1,
            b: 3,
        });
    });
});
describe("Options - default values", () => {
    function getDeclaration(type, defaultValue) {
        return {
            type,
            defaultValue,
            name: "test",
            help: emptyHelp,
        };
    }
    it("String", () => {
        (0, assert_1.deepStrictEqual)((0, declaration_1.getDefaultValue)(getDeclaration(declaration_1.ParameterType.String, void 0)), "");
        (0, assert_1.deepStrictEqual)((0, declaration_1.getDefaultValue)(getDeclaration(declaration_1.ParameterType.String, "foo")), "foo");
    });
    it("Path", () => {
        (0, assert_1.deepStrictEqual)((0, declaration_1.getDefaultValue)(getDeclaration(declaration_1.ParameterType.Path, void 0)), "");
        (0, assert_1.deepStrictEqual)((0, declaration_1.getDefaultValue)(getDeclaration(declaration_1.ParameterType.Path, "foo")), (0, path_1.resolve)("foo"));
    });
    it("Number", () => {
        (0, assert_1.deepStrictEqual)((0, declaration_1.getDefaultValue)(getDeclaration(declaration_1.ParameterType.Number, void 0)), 0);
        (0, assert_1.deepStrictEqual)((0, declaration_1.getDefaultValue)(getDeclaration(declaration_1.ParameterType.Number, 123)), 123);
        (0, assert_1.ok)(Number.isNaN((0, declaration_1.getDefaultValue)(getDeclaration(declaration_1.ParameterType.Number, NaN))));
    });
    it("Boolean", () => {
        (0, assert_1.deepStrictEqual)((0, declaration_1.getDefaultValue)(getDeclaration(declaration_1.ParameterType.Boolean, void 0)), false);
        (0, assert_1.deepStrictEqual)((0, declaration_1.getDefaultValue)(getDeclaration(declaration_1.ParameterType.Boolean, true)), true);
    });
    it("Map", () => {
        (0, assert_1.deepStrictEqual)((0, declaration_1.getDefaultValue)(getDeclaration(declaration_1.ParameterType.Map, void 0)), void 0);
        const def = {};
        (0, assert_1.ok)((0, declaration_1.getDefaultValue)(getDeclaration(declaration_1.ParameterType.Map, def)) === def);
    });
    it("Mixed", () => {
        (0, assert_1.deepStrictEqual)((0, declaration_1.getDefaultValue)(getDeclaration(declaration_1.ParameterType.Mixed, void 0)), void 0);
        const def = {};
        (0, assert_1.ok)((0, declaration_1.getDefaultValue)(getDeclaration(declaration_1.ParameterType.Mixed, def)) === def);
    });
    it("Array", () => {
        (0, assert_1.deepStrictEqual)((0, declaration_1.getDefaultValue)(getDeclaration(declaration_1.ParameterType.Array, void 0)), []);
        (0, assert_1.deepStrictEqual)((0, declaration_1.getDefaultValue)(getDeclaration(declaration_1.ParameterType.Array, ["a"])), [
            "a",
        ]);
    });
    it("PathArray", () => {
        (0, assert_1.deepStrictEqual)((0, declaration_1.getDefaultValue)(getDeclaration(declaration_1.ParameterType.PathArray, void 0)), []);
        (0, assert_1.deepStrictEqual)((0, declaration_1.getDefaultValue)(getDeclaration(declaration_1.ParameterType.PathArray, ["a"])), [
            (0, path_1.resolve)("a"),
        ]);
        (0, assert_1.deepStrictEqual)((0, declaration_1.getDefaultValue)(getDeclaration(declaration_1.ParameterType.PathArray, ["/a"])), [(0, path_1.resolve)("/a")]);
    });
    it("ModuleArray", () => {
        (0, assert_1.deepStrictEqual)((0, declaration_1.getDefaultValue)(getDeclaration(declaration_1.ParameterType.ModuleArray, void 0)), []);
        (0, assert_1.deepStrictEqual)((0, declaration_1.getDefaultValue)(getDeclaration(declaration_1.ParameterType.ModuleArray, ["a"])), ["a"]);
        (0, assert_1.deepStrictEqual)((0, declaration_1.getDefaultValue)(getDeclaration(declaration_1.ParameterType.ModuleArray, ["./a"])), [(0, path_1.resolve)("./a")]);
    });
    it("GlobArray", () => {
        (0, assert_1.deepStrictEqual)((0, declaration_1.getDefaultValue)(getDeclaration(declaration_1.ParameterType.GlobArray, void 0)), []);
        (0, assert_1.deepStrictEqual)((0, declaration_1.getDefaultValue)(getDeclaration(declaration_1.ParameterType.GlobArray, ["a"])), [
            (0, path_1.resolve)("a"),
        ]);
        (0, assert_1.deepStrictEqual)((0, declaration_1.getDefaultValue)(getDeclaration(declaration_1.ParameterType.GlobArray, ["**a"])), ["**a"]);
        (0, assert_1.deepStrictEqual)((0, declaration_1.getDefaultValue)(getDeclaration(declaration_1.ParameterType.GlobArray, ["#!a"])), ["#!" + (0, path_1.resolve)("a")]);
    });
});
//# sourceMappingURL=declaration.test.js.map