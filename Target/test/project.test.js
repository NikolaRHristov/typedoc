"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const __1 = require("..");
describe("Project", function () {
    describe("splitUnquotedString", () => {
        let result;
        it("unquoted string", function () {
            result = (0, __1.splitUnquotedString)("foo.bar", ".");
            assert_1.default.strictEqual(result.length, 2, "Wrong length");
            assert_1.default.strictEqual(result[0], "foo", "Wrong split");
            assert_1.default.strictEqual(result[1], "bar", "Wrong split");
        });
        it("quoted string", function () {
            result = (0, __1.splitUnquotedString)('"foo.bar"', ".");
            assert_1.default.strictEqual(result.length, 1, "Wrong length");
            assert_1.default.strictEqual(result[0], '"foo.bar"', "Wrong split");
        });
        it("quoted start, unquoted end", function () {
            result = (0, __1.splitUnquotedString)('"foo.d".bar', ".");
            assert_1.default.strictEqual(result.length, 2, "Wrong length");
            assert_1.default.strictEqual(result[0], '"foo.d"', "Wrong split");
            assert_1.default.strictEqual(result[1], "bar", "Wrong split");
        });
        it("unmatched quotes", function () {
            result = (0, __1.splitUnquotedString)('"foo.d', ".");
            assert_1.default.strictEqual(result.length, 2, "Wrong length");
            assert_1.default.strictEqual(result[0], '"foo', "Wrong split");
            assert_1.default.strictEqual(result[1], "d", "Wrong split");
        });
    });
});
