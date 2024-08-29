"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = require("assert");
const utils_1 = require("../../lib/utils");
const validation_1 = require("../../lib/utils/validation");
describe("Validation Utils", () => {
    it("Should be able to validate optional values", () => {
        (0, assert_1.ok)(utils_1.Validation.validate(utils_1.Validation.optional(String), null));
        (0, assert_1.ok)(utils_1.Validation.validate(utils_1.Validation.optional(String), undefined));
        (0, assert_1.ok)(utils_1.Validation.validate(utils_1.Validation.optional(String), ""));
    });
    it("Should be able to validate a boolean", () => {
        (0, assert_1.ok)(utils_1.Validation.validate(Boolean, false));
        (0, assert_1.ok)(!utils_1.Validation.validate(Boolean, 123));
        (0, assert_1.ok)(!utils_1.Validation.validate(Boolean, ""));
    });
    it("Should be able to validate a number", () => {
        (0, assert_1.ok)(!utils_1.Validation.validate(Number, false));
        (0, assert_1.ok)(utils_1.Validation.validate(Number, 123));
        (0, assert_1.ok)(!utils_1.Validation.validate(Number, ""));
    });
    it("Should be able to validate a string", () => {
        (0, assert_1.ok)(!utils_1.Validation.validate(String, false));
        (0, assert_1.ok)(!utils_1.Validation.validate(String, 123));
        (0, assert_1.ok)(utils_1.Validation.validate(String, ""));
    });
    it("Should be able to validate an array", () => {
        (0, assert_1.ok)(utils_1.Validation.validate([Array, String], []));
        (0, assert_1.ok)(utils_1.Validation.validate([Array, String], ["a"]));
        (0, assert_1.ok)(!utils_1.Validation.validate([Array, String], ["a", 1]));
    });
    it("Should be able to validate with a custom function", () => {
        (0, assert_1.ok)(utils_1.Validation.validate(utils_1.Validation.isTagString, "@foo"));
        (0, assert_1.ok)(!utils_1.Validation.validate(utils_1.Validation.isTagString, true));
    });
    it("Should be able to validate a set of literals", () => {
        (0, assert_1.ok)(utils_1.Validation.validate(["a", "b", "c"], "a"));
        (0, assert_1.ok)(utils_1.Validation.validate(["a", "b", "c"], "c"));
        (0, assert_1.ok)(!utils_1.Validation.validate(["a", "b", "c"], "d"));
    });
    it("Should be able to validate an object", () => {
        const schema = {
            x: String,
            y: utils_1.Validation.optional(Number),
        };
        (0, assert_1.ok)(utils_1.Validation.validate(schema, { x: "" }));
        (0, assert_1.ok)(utils_1.Validation.validate(schema, { x: "", y: 0 }));
        (0, assert_1.ok)(utils_1.Validation.validate(schema, { x: "", y: 0, z: 123 }));
        (0, assert_1.ok)(!utils_1.Validation.validate(schema, { y: 123 }));
        (0, assert_1.ok)(!utils_1.Validation.validate(schema, null));
        (0, assert_1.ok)(!utils_1.Validation.validate(schema, true));
    });
    it("Should support not checking for excess properties (default)", () => {
        const schema = {
            x: String,
            [validation_1.additionalProperties]: true,
        };
        (0, assert_1.ok)(utils_1.Validation.validate(schema, { x: "" }));
        (0, assert_1.ok)(utils_1.Validation.validate(schema, { x: "", y: "" }));
    });
    it("Should support checking for excess properties", () => {
        const schema = {
            x: String,
            [validation_1.additionalProperties]: false,
        };
        (0, assert_1.ok)(utils_1.Validation.validate(schema, { x: "" }));
        (0, assert_1.ok)(!utils_1.Validation.validate(schema, { x: "", y: "" }));
    });
});
