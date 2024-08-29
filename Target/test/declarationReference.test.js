"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = require("assert");
const declarationReference_1 = require("../lib/converter/comments/declarationReference");
describe("Declaration References", () => {
    describe("String parsing", () => {
        const parse = (s) => (0, declarationReference_1.parseString)(s, 0, s.length)?.[0];
        it("Fails if string does not start with a double quote", () => {
            (0, assert_1.deepStrictEqual)(parse("x"), undefined);
        });
        it("Fails if string includes a line terminator", () => {
            (0, assert_1.deepStrictEqual)(parse('"a\nb"'), undefined);
        });
        it("Fails if string is unclosed", () => {
            (0, assert_1.deepStrictEqual)(parse('"abc'), undefined);
        });
        it("Bails on bad escapes", () => {
            (0, assert_1.deepStrictEqual)(parse('"\\123"'), undefined);
            (0, assert_1.deepStrictEqual)(parse('"\\xZZ"'), undefined);
            (0, assert_1.deepStrictEqual)(parse('"\\uAAAZ"'), undefined);
            (0, assert_1.deepStrictEqual)(parse('"\\u4"'), undefined);
            (0, assert_1.deepStrictEqual)(parse('"\\u{41"'), undefined);
            (0, assert_1.deepStrictEqual)(parse('"\\uZ"'), undefined);
            (0, assert_1.deepStrictEqual)(parse('"\\u{FFFFFFFFFFFFFFFFFFFFFFF}"'), undefined);
        });
        it("Parses successfully", () => {
            (0, assert_1.deepStrictEqual)(parse('"abc\\x41\\u0041\\u{42}z\\n\\a\\0"'), "abcAABz\na\0");
        });
    });
    describe("Component parsing", () => {
        const parse = (s) => (0, declarationReference_1.parseComponent)(s, 0, s.length)?.[0];
        it("Fails if it is an invalid string", () => {
            (0, assert_1.deepStrictEqual)(parse('"asdf'), undefined);
        });
        it("Fails if there is no valid string", () => {
            (0, assert_1.deepStrictEqual)(parse(""), undefined);
            (0, assert_1.deepStrictEqual)(parse("\n"), undefined);
        });
        it("Reads valid component", () => {
            (0, assert_1.deepStrictEqual)(parse("abc"), "abc");
            (0, assert_1.deepStrictEqual)(parse('"abc"'), "abc");
        });
    });
    describe("Component Path parsing", () => {
        const parse = (s) => (0, declarationReference_1.parseComponentPath)(s, 0, s.length)?.[0];
        it("Fails if it is an invalid string", () => {
            (0, assert_1.deepStrictEqual)(parse('"asdf'), undefined);
        });
        it("Fails if a later part of the path fails to parse", () => {
            (0, assert_1.deepStrictEqual)(parse('a."asdf'), undefined);
        });
        it("Parses a path", () => {
            (0, assert_1.deepStrictEqual)(parse("a.b"), [
                { navigation: ".", path: "a" },
                { navigation: ".", path: "b" },
            ]);
            (0, assert_1.deepStrictEqual)(parse('a#"b"'), [
                { navigation: ".", path: "a" },
                { navigation: "#", path: "b" },
            ]);
        });
    });
    describe("Meaning parsing", () => {
        const parse = (s) => {
            const meaning = (0, declarationReference_1.parseMeaning)(s, 0, s.length);
            if (meaning) {
                (0, assert_1.deepStrictEqual)(meaning[1], s.length, "Parse did not consume full string");
            }
            return meaning?.[0];
        };
        it("Fails if string does not start with :", () => {
            (0, assert_1.deepStrictEqual)(parse("class"), undefined);
        });
        it("Parses a bare keyword", () => {
            (0, assert_1.deepStrictEqual)(parse(":class"), { keyword: "class" });
        });
        it("Parses a keyword with index", () => {
            (0, assert_1.deepStrictEqual)(parse(":class(123)"), { keyword: "class", index: 123 });
        });
        it("Does not parse index if invalid", () => {
            const input = ":class(123";
            const meaning = (0, declarationReference_1.parseMeaning)(input, 0, input.length);
            (0, assert_1.deepStrictEqual)(meaning, [{ keyword: "class" }, ":class".length]);
        });
        it("Parses an index", () => {
            (0, assert_1.deepStrictEqual)(parse(":(123)"), { keyword: undefined, index: 123 });
        });
        it("Parses a bare index", () => {
            (0, assert_1.deepStrictEqual)(parse(":123"), { index: 123 });
        });
        it("Parses a user identifier", () => {
            (0, assert_1.deepStrictEqual)(parse(":USER_IDENT"), { label: "USER_IDENT" });
        });
    });
    describe("Symbol reference parsing", () => {
        const parse = (s) => (0, declarationReference_1.parseSymbolReference)(s, 0, s.length)?.[0];
        it("Fails if both parses fail", () => {
            (0, assert_1.deepStrictEqual)(parse(":bad"), undefined);
        });
        it("Succeeds if path succeeds", () => {
            (0, assert_1.deepStrictEqual)(parse("a"), {
                path: [{ navigation: ".", path: "a" }],
                meaning: undefined,
            });
        });
        it("Succeeds if meaning succeeds", () => {
            (0, assert_1.deepStrictEqual)(parse(":class"), {
                path: undefined,
                meaning: { keyword: "class" },
            });
        });
        it("Succeeds both succeed", () => {
            (0, assert_1.deepStrictEqual)(parse("a:class(1)"), {
                path: [{ navigation: ".", path: "a" }],
                meaning: { keyword: "class", index: 1 },
            });
        });
    });
    describe("Module source parsing", () => {
        const parse = (s) => (0, declarationReference_1.parseModuleSource)(s, 0, s.length)?.[0];
        it("Fails if empty", () => {
            (0, assert_1.deepStrictEqual)(parse(""), undefined);
            (0, assert_1.deepStrictEqual)(parse("!"), undefined);
        });
        it("Parses strings", () => {
            (0, assert_1.deepStrictEqual)(parse('"ab"'), "ab");
        });
        it("Parses module source characters", () => {
            (0, assert_1.deepStrictEqual)(parse("abc.def"), "abc.def");
        });
    });
    describe("Full reference parsing", () => {
        const parse = (s) => (0, declarationReference_1.parseDeclarationReference)(s, 0, s.length)?.[0];
        it("Parses module if there is one", () => {
            (0, assert_1.deepStrictEqual)(parse("abc!"), {
                moduleSource: "abc",
                resolutionStart: "global",
                symbolReference: undefined,
            });
        });
        it("Does not parse module if there is not one", () => {
            (0, assert_1.deepStrictEqual)(parse("abc#def"), {
                moduleSource: undefined,
                resolutionStart: "local",
                symbolReference: {
                    path: [
                        { navigation: ".", path: "abc" },
                        { navigation: "#", path: "def" },
                    ],
                    meaning: undefined,
                },
            });
        });
        it("Supports referencing global symbols", () => {
            (0, assert_1.deepStrictEqual)(parse("!abc#def"), {
                moduleSource: undefined,
                resolutionStart: "global",
                symbolReference: {
                    path: [
                        { navigation: ".", path: "abc" },
                        { navigation: "#", path: "def" },
                    ],
                    meaning: undefined,
                },
            });
        });
        it("Doesn't crash with an empty/invalid reference", () => {
            (0, assert_1.deepStrictEqual)(parse(""), undefined);
            (0, assert_1.deepStrictEqual)(parse("@test/foo"), undefined);
        });
    });
});
