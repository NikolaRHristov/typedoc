"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = require("assert");
const index_1 = require("../../index");
describe("Comment.combineDisplayParts", () => {
    it("Handles text and code", () => {
        const parts = [
            { kind: "text", text: "a" },
            { kind: "code", text: "`b`" },
        ];
        (0, assert_1.deepStrictEqual)(index_1.Comment.combineDisplayParts(parts), "a`b`");
    });
    it("Handles inline tags", () => {
        const parts = [
            { kind: "inline-tag", text: "`b`", tag: "@test" },
        ];
        (0, assert_1.deepStrictEqual)(index_1.Comment.combineDisplayParts(parts), "{@test `b`}");
    });
});
describe("Comment.splitPartsToHeaderAndBody", () => {
    it("Handles a simple case", () => {
        const parts = [{ kind: "text", text: "a\nb" }];
        (0, assert_1.deepStrictEqual)(index_1.Comment.splitPartsToHeaderAndBody(parts), {
            header: "a",
            body: [{ kind: "text", text: "b" }],
        });
    });
    it("Refuses to split a code block", () => {
        const parts = [{ kind: "code", text: "`a\nb`" }];
        (0, assert_1.deepStrictEqual)(index_1.Comment.splitPartsToHeaderAndBody(parts), {
            header: "",
            body: [{ kind: "code", text: "`a\nb`" }],
        });
    });
    it("Handles a newline in a code block after text", () => {
        const parts = [
            { kind: "text", text: "Header" },
            { kind: "code", text: "`a\nb`" },
        ];
        (0, assert_1.deepStrictEqual)(index_1.Comment.splitPartsToHeaderAndBody(parts), {
            header: "Header",
            body: [{ kind: "code", text: "`a\nb`" }],
        });
    });
    it("Handles header consisting of multiple display parts", () => {
        const parts = [
            { kind: "text", text: "Header" },
            { kind: "text", text: " more " },
            { kind: "text", text: "text\nbody" },
        ];
        (0, assert_1.deepStrictEqual)(index_1.Comment.splitPartsToHeaderAndBody(parts), {
            header: "Header more text",
            body: [{ kind: "text", text: "body" }],
        });
    });
    it("Handles empty body", () => {
        const parts = [
            { kind: "text", text: "Header\n" },
        ];
        (0, assert_1.deepStrictEqual)(index_1.Comment.splitPartsToHeaderAndBody(parts), {
            header: "Header",
            body: [],
        });
    });
    it("Trims the header text", () => {
        const parts = [
            { kind: "text", text: "Header  \n" },
        ];
        (0, assert_1.deepStrictEqual)(index_1.Comment.splitPartsToHeaderAndBody(parts), {
            header: "Header",
            body: [],
        });
    });
});
