"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = require("assert");
const utils_1 = require("../../lib/utils");
describe("JSX", () => {
    it("Works with basic case", () => {
        const element = (utils_1.JSX.createElement("details", { "data-a": "foo", open: true }, "Text"));
        (0, assert_1.deepStrictEqual)((0, utils_1.renderElement)(element), '<details data-a="foo" open>Text</details>');
    });
    it("Escapes string content", () => {
        (0, assert_1.deepStrictEqual)((0, utils_1.renderElement)(utils_1.JSX.createElement("div", null, "<>")), "<div>&lt;&gt;</div>");
    });
    it("Renders to the empty string if no component is provided", () => {
        (0, assert_1.deepStrictEqual)((0, utils_1.renderElement)(null), "");
        (0, assert_1.deepStrictEqual)((0, utils_1.renderElement)(void 0), "");
    });
    it("Supports component functions", () => {
        const Component = (props) => utils_1.JSX.createElement("span", null, props.text);
        (0, assert_1.deepStrictEqual)((0, utils_1.renderElement)(utils_1.JSX.createElement(Component, { text: "hi!" })), "<span>hi!</span>");
    });
    it("Recognizes void elements", () => {
        (0, assert_1.deepStrictEqual)((0, utils_1.renderElement)(utils_1.JSX.createElement("div", { id: "main" })), '<div id="main"></div>');
    });
    it("Does not render null or undefined attributes", () => {
        (0, assert_1.deepStrictEqual)((0, utils_1.renderElement)(utils_1.JSX.createElement("div", { "data-foo": null })), "<div></div>");
        (0, assert_1.deepStrictEqual)((0, utils_1.renderElement)(utils_1.JSX.createElement("div", { "data-foo": void 0 })), "<div></div>");
    });
    it("Handles false boolean attributes", () => {
        (0, assert_1.deepStrictEqual)((0, utils_1.renderElement)(utils_1.JSX.createElement("details", { open: false })), "<details></details>");
    });
    it("Supports children", () => {
        const Component = (props) => utils_1.JSX.createElement("span", null, props.text);
        const element = (utils_1.JSX.createElement("div", null,
            null,
            undefined,
            ["a", "b"],
            utils_1.JSX.createElement(Component, { text: "hi" })));
        (0, assert_1.deepStrictEqual)((0, utils_1.renderElement)(element), "<div>ab<span>hi</span></div>");
    });
    it("Supports fragments", () => {
        (0, assert_1.deepStrictEqual)((0, utils_1.renderElement)(utils_1.JSX.createElement(utils_1.JSX.Fragment, null,
            utils_1.JSX.createElement("div", null, "A"),
            utils_1.JSX.createElement("div", null, "B"))), "<div>A</div><div>B</div>");
    });
    it("Supports <Raw /> for injecting HTML", () => {
        (0, assert_1.deepStrictEqual)((0, utils_1.renderElement)(utils_1.JSX.createElement(utils_1.Raw, { html: "<strong>foo</strong>" })), "<strong>foo</strong>");
    });
    it("Supports SVG elements", () => {
        (0, assert_1.deepStrictEqual)((0, utils_1.renderElement)(utils_1.JSX.createElement("svg", { viewBox: "0 0 100 100", xmlns: "http://www.w3.org/2000/svg" },
            utils_1.JSX.createElement("path", { d: "M 10,30" }))), `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <path d="M 10,30"></path>
            </svg>`.replace(/^\s*|\r?\n/gm, ""));
    });
    it("Properly escapes quotes in html attributes", () => {
        const quot = `test"quote`;
        (0, assert_1.deepStrictEqual)((0, utils_1.renderElement)(utils_1.JSX.createElement("div", { "data-foo": quot })), `<div data-foo="test&quot;quote"></div>`);
    });
});
//# sourceMappingURL=jsx.test.js.map