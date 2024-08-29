"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = require("assert");
const models_1 = require("../../lib/models");
const enum_1 = require("../../lib/utils/enum");
describe("Enum utils", () => {
    it("Should be able to get enum keys", () => {
        const keys = (0, enum_1.getEnumKeys)(models_1.ReflectionKind);
        (0, assert_1.ok)(keys.includes("Project"));
        (0, assert_1.ok)(!keys.includes("SignatureContainer"));
    });
});
