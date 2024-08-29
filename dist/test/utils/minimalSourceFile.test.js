"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = require("assert");
const minimalSourceFile_1 = require("../../lib/utils/minimalSourceFile");
describe("MinimalSourceFile", () => {
	it("Should do bounds checking", () => {
		const sf = new minimalSourceFile_1.MinimalSourceFile(
			"abc\n123\n4\n5",
			"",
		);
		(0, assert_1.throws)(() => sf.getLineAndCharacterOfPosition(-1));
		(0, assert_1.throws)(() => sf.getLineAndCharacterOfPosition(1000));
	});
	it("Should support calculating lines", () => {
		const sf = new minimalSourceFile_1.MinimalSourceFile(
			"abc\n123\n4\n5",
			"",
		);
		const check = (s, pos) =>
			(0, assert_1.deepStrictEqual)(
				sf.getLineAndCharacterOfPosition(sf.text.indexOf(s)),
				pos,
			);
		check("a", { line: 0, character: 0 });
		check("b", { line: 0, character: 1 });
		check("\n", { line: 0, character: 3 });
		check("1", { line: 1, character: 0 });
		check("2", { line: 1, character: 1 });
		check("4", { line: 2, character: 0 });
		check("5", { line: 3, character: 0 });
	});
	it("#2605 Should handle multiple consecutive newlines", () => {
		const sf = new minimalSourceFile_1.MinimalSourceFile("a\n\nb", "");
		(0, assert_1.deepStrictEqual)(sf.getLineAndCharacterOfPosition(0), {
			line: 0,
			character: 0,
		}); // a
		(0, assert_1.deepStrictEqual)(sf.getLineAndCharacterOfPosition(1), {
			line: 0,
			character: 1,
		}); // \n
		(0, assert_1.deepStrictEqual)(sf.getLineAndCharacterOfPosition(2), {
			line: 1,
			character: 0,
		}); // \n
		(0, assert_1.deepStrictEqual)(sf.getLineAndCharacterOfPosition(3), {
			line: 2,
			character: 0,
		}); // b
	});
});
