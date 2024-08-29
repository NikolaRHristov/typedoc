"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = require("assert/strict");
const path_1 = require("path");
const typescript_1 = __importDefault(require("typescript"));
const defaults = __importStar(require("../../../lib/utils/options/tsdoc-defaults"));
describe("tsdoc-defaults.ts", () => {
    const tsdoc = typescript_1.default.readConfigFile((0, path_1.join)(__dirname, "../../../../tsdoc.json"), typescript_1.default.sys.readFile);
    const tagDefinitions = tsdoc.config?.tagDefinitions;
    function tagsByKind(kind) {
        return tagDefinitions
            .filter((t) => t.syntaxKind === kind)
            .map((t) => t.tagName)
            .sort((a, b) => a.localeCompare(b));
    }
    before(() => {
        (0, strict_1.deepEqual)(tsdoc.error, undefined);
    });
    it("Should expose the same block tags as the tsdoc.json file", () => {
        const tsdocTags = tagsByKind("block");
        const typedocTags = defaults.blockTags
            .filter((t) => !defaults.tsdocBlockTags.includes(t))
            .sort((a, b) => a.localeCompare(b));
        // @inheritDoc is a special case. We can't specify it in the tsdoc.json
        // or the official parser blows up, because it thinks that it is only
        // an inline tag.
        typedocTags.splice(typedocTags.indexOf("@inheritDoc"), 1);
        (0, strict_1.deepEqual)(tsdocTags, typedocTags);
    });
    it("Should expose the same modifier tags as the tsdoc.json file", () => {
        const tsdocTags = tagsByKind("modifier");
        const typedocTags = defaults.modifierTags
            .filter((t) => !defaults.tsdocModifierTags.includes(t))
            .sort((a, b) => a.localeCompare(b));
        (0, strict_1.deepEqual)(tsdocTags, typedocTags);
    });
    it("Should expose the same inline tags as the tsdoc.json file", () => {
        const tsdocTags = tagsByKind("inline");
        const typedocTags = defaults.inlineTags
            .filter((t) => !defaults.tsdocInlineTags.includes(t))
            .sort((a, b) => a.localeCompare(b));
        (0, strict_1.deepEqual)(tsdocTags, typedocTags);
    });
});
//# sourceMappingURL=tsdoc-defaults.test.js.map