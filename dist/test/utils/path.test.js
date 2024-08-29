"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = require("assert");
const utils_1 = require("../../lib/utils");
describe("normalizePath", () => {
	const winTest = process.platform === "win32" ? it : it.skip;
	const nixTest = process.platform === "win32" ? it.skip : it;
	winTest("Returns paths with forward slashes", () => {
		(0, assert_1.equal)(
			(0, utils_1.normalizePath)("test\\test\\another/forward"),
			"test/test/another/forward",
		);
	});
	winTest("Normalizes drive letters", () => {
		(0, assert_1.equal)((0, utils_1.normalizePath)("c:\\foo"), "C:/foo");
		(0, assert_1.equal)((0, utils_1.normalizePath)("D:/foo"), "D:/foo");
	});
	winTest("Checks for unix style paths", () => {
		(0, assert_1.equal)(
			(0, utils_1.normalizePath)("/c/users/you"),
			"C:/users/you",
		);
	});
	nixTest("Returns the original path", () => {
		(0, assert_1.equal)(
			(0, utils_1.normalizePath)("/c/users\\foo"),
			"/c/users\\foo",
		);
	});
});
