"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = require("assert");
const utils_1 = require("../../../lib/utils");
const internationalization_1 = require("../../../lib/internationalization/internationalization");
describe("Default Options", () => {
	const opts = new utils_1.Options(
		new internationalization_1.Internationalization(null).proxy,
	);
	describe("Highlighting theme", () => {
		it("Errors if an invalid theme is provided", () => {
			(0, assert_1.throws)(() =>
				opts.setValue("lightHighlightTheme", "randomTheme"),
			);
			opts.setValue("lightHighlightTheme", "github-light");
			(0, assert_1.strictEqual)(
				opts.getValue("lightHighlightTheme"),
				"github-light",
			);
			(0, assert_1.throws)(() =>
				opts.setValue("darkHighlightTheme", "randomTheme"),
			);
			opts.setValue("darkHighlightTheme", "github-light");
			(0, assert_1.strictEqual)(
				opts.getValue("darkHighlightTheme"),
				"github-light",
			);
		});
	});
	describe("sort", () => {
		it("Errors if an invalid sort version is provided", () => {
			(0, assert_1.throws)(() =>
				opts.setValue("sort", ["random", "alphabetical"]),
			);
		});
		it("Reports which sort option(s) was invalid", () => {
			try {
				opts.setValue("sort", ["random", "alphabetical", "foo"]);
			} catch (e) {
				(0, assert_1.ok)(e instanceof Error);
				(0, assert_1.ok)(e.message.includes("random"));
				(0, assert_1.ok)(e.message.includes("foo"));
			}
		});
	});
	describe("markdownItOptions", () => {
		it("Errors if given a non-object", () => {
			(0, assert_1.throws)(() =>
				opts.setValue("markdownItOptions", null),
			);
			(0, assert_1.throws)(() =>
				opts.setValue("markdownItOptions", "bad"),
			);
			(0, assert_1.throws)(() => opts.setValue("markdownItOptions", []));
		});
	});
	describe("compilerOptions", () => {
		it("Errors if given a non-object", () => {
			(0, assert_1.throws)(() => opts.setValue("compilerOptions", "bad"));
			(0, assert_1.throws)(() => opts.setValue("compilerOptions", null));
			(0, assert_1.throws)(() => opts.setValue("compilerOptions", []));
		});
	});
	describe("requiredToBeDocumented", () => {
		it("Works with valid values", () => {
			(0, assert_1.doesNotThrow)(() =>
				opts.setValue("requiredToBeDocumented", ["Enum"]),
			);
		});
		it("Throws on invalid values", () => {
			(0, assert_1.throws)(() =>
				opts.setValue("requiredToBeDocumented", ["Enum2"]),
			);
		});
	});
	describe("searchCategoryBoosts", () => {
		it("Should disallow non-objects", () => {
			(0, assert_1.throws)(() =>
				opts.setValue("searchCategoryBoosts", null),
			);
		});
		it("Should disallow non-numbers", () => {
			(0, assert_1.throws)(() =>
				opts.setValue("searchCategoryBoosts", {
					cat: true,
				}),
			);
		});
	});
	describe("searchGroupBoosts", () => {
		it("Should disallow non-objects", () => {
			(0, assert_1.throws)(() =>
				opts.setValue("searchGroupBoosts", null),
			);
		});
		it("Should disallow non-numbers", () => {
			(0, assert_1.throws)(() =>
				opts.setValue("searchGroupBoosts", {
					Enum: true,
				}),
			);
		});
		it("Should allow groups", () => {
			(0, assert_1.doesNotThrow)(() =>
				opts.setValue("searchGroupBoosts", { Enum: 5 }),
			);
		});
	});
	describe("headerLinks", () => {
		it("Should disallow non-objects", () => {
			(0, assert_1.throws)(() => opts.setValue("navigationLinks", null));
		});
		it("Should disallow non-strings", () => {
			(0, assert_1.throws)(() =>
				opts.setValue("navigationLinks", {
					Home: true,
				}),
			);
		});
	});
	describe("sidebarLinks", () => {
		it("Should disallow non-objects", () => {
			(0, assert_1.throws)(() => opts.setValue("sidebarLinks", null));
		});
		it("Should disallow non-strings", () => {
			(0, assert_1.throws)(() =>
				opts.setValue("sidebarLinks", {
					Home: true,
				}),
			);
		});
	});
});
