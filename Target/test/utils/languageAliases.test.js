"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = require("assert");
const highlighter_1 = require("../../lib/utils/highlighter");
describe("Language aliases", () => {
    describe("Original language aliases", () => {
        it("js is present", () => {
            (0, assert_1.deepStrictEqual)((0, highlighter_1.isSupportedLanguage)("js"), true);
        });
        it("ts is present", () => {
            (0, assert_1.deepStrictEqual)((0, highlighter_1.isSupportedLanguage)("ts"), true);
        });
        it("sh is present", () => {
            (0, assert_1.deepStrictEqual)((0, highlighter_1.isSupportedLanguage)("sh"), true);
        });
        it("bash is present", () => {
            (0, assert_1.deepStrictEqual)((0, highlighter_1.isSupportedLanguage)("bash"), true);
        });
        it("zsh is present", () => {
            (0, assert_1.deepStrictEqual)((0, highlighter_1.isSupportedLanguage)("zsh"), true);
        });
        it("text is present", () => {
            (0, assert_1.deepStrictEqual)((0, highlighter_1.isSupportedLanguage)("text"), true);
        });
    });
    // non-exhaustive, just shows that some of the uncovered ones are now covered
    describe("Extended language aliases", () => {
        it("rb is present", () => {
            (0, assert_1.deepStrictEqual)((0, highlighter_1.isSupportedLanguage)("rb"), true);
        });
        it("py is present", () => {
            (0, assert_1.deepStrictEqual)((0, highlighter_1.isSupportedLanguage)("py"), true);
        });
        it("jssm is present", () => {
            (0, assert_1.deepStrictEqual)((0, highlighter_1.isSupportedLanguage)("jssm"), true);
        });
    });
    // non-exhaustive, just shows that the basic names are upheld too
    describe("Basic ids", () => {
        it("ruby is present", () => {
            (0, assert_1.deepStrictEqual)((0, highlighter_1.isSupportedLanguage)("ruby"), true);
        });
        it("python is present", () => {
            (0, assert_1.deepStrictEqual)((0, highlighter_1.isSupportedLanguage)("python"), true);
        });
        it("javascript is present", () => {
            (0, assert_1.deepStrictEqual)((0, highlighter_1.isSupportedLanguage)("javascript"), true);
        });
        it("typescript is present", () => {
            (0, assert_1.deepStrictEqual)((0, highlighter_1.isSupportedLanguage)("typescript"), true);
        });
        it("fsl is present", () => {
            (0, assert_1.deepStrictEqual)((0, highlighter_1.isSupportedLanguage)("fsl"), true);
        });
    });
    describe("Improper language aliases", () => {
        it("js2 is not present", () => {
            (0, assert_1.deepStrictEqual)((0, highlighter_1.isSupportedLanguage)("js2"), false);
        });
    });
});
//# sourceMappingURL=languageAliases.test.js.map