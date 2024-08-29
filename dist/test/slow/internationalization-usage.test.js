"use strict";
var __importDefault =
	(this && this.__importDefault) ||
	function (mod) {
		return mod && mod.__esModule ? mod : { "default": mod };
	};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = require("assert/strict");
const fs_1 = require("fs");
const path_1 = require("path");
const typescript_1 = __importDefault(require("typescript"));
const __1 = require("../..");
const internationalization_1 = require("../../lib/internationalization/internationalization");
describe("Internationalization", () => {
	it("Does not include strings in translatable object which are unused", () => {
		const options = new __1.Options(
			new internationalization_1.Internationalization(null).proxy,
		);
		const tsconfigReader = new __1.TSConfigReader();
		tsconfigReader.read(options, new __1.Logger(), process.cwd());
		const translatableTs = (0, path_1.join)(
			__dirname,
			"../../lib/internationalization/translatable.ts",
		);
		const host = {
			getScriptFileNames: () => options.getFileNames().slice(),
			getScriptVersion: () => "unused",
			getScriptSnapshot: (fileName) => {
				if (!(0, fs_1.existsSync)(fileName)) return undefined;
				return typescript_1.default.ScriptSnapshot.fromString(
					(0, fs_1.readFileSync)(fileName, "utf-8"),
				);
			},
			getCurrentDirectory: () => process.cwd(),
			getCompilationSettings: () => options.getCompilerOptions(),
			getDefaultLibFileName: (opts) =>
				typescript_1.default.getDefaultLibFilePath(opts),
			fileExists: typescript_1.default.sys.fileExists,
			readFile: typescript_1.default.sys.readFile,
			readDirectory: typescript_1.default.sys.readDirectory,
			directoryExists: typescript_1.default.sys.directoryExists,
			getDirectories: typescript_1.default.sys.getDirectories,
		};
		const service = typescript_1.default.createLanguageService(
			host,
			typescript_1.default.createDocumentRegistry(),
		);
		const program = service.getProgram();
		(0, strict_1.ok)(program, "Failed to get program for i18n analysis");
		const sf = program.getSourceFile(translatableTs);
		(0, strict_1.ok)(sf, "Failed to get source file");
		const moduleSymbol = program.getTypeChecker().getSymbolAtLocation(sf);
		const translatable = program
			.getTypeChecker()
			.tryGetMemberInModuleExports("translatable", moduleSymbol);
		(0, strict_1.ok)(translatable, "Failed to get translatable symbol");
		(0, strict_1.ok)(
			typescript_1.default.isVariableDeclaration(
				translatable.valueDeclaration,
			),
		);
		(0, strict_1.ok)(
			typescript_1.default.isAsExpression(
				translatable.valueDeclaration.initializer,
			),
		);
		(0, strict_1.ok)(
			typescript_1.default.isObjectLiteralExpression(
				translatable.valueDeclaration.initializer.expression,
			),
		);
		const translatableObj =
			translatable.valueDeclaration.initializer.expression;
		translatableObj.forEachChild((child) => {
			(0, strict_1.ok)(typescript_1.default.isPropertyAssignment(child));
			const refs = service.getReferencesAtPosition(
				sf.fileName,
				child.getStart(),
			);
			const refCount =
				refs?.filter(
					(ref) =>
						!/locales\/.*\.cts$/.test(ref.fileName) &&
						!ref.fileName.endsWith("translatable.ts"),
				).length ?? 0;
			(0, strict_1.ok)(
				refCount,
				`Translatable key ${child.name.getText()} is not referenced.`,
			);
		});
		service.dispose();
	});
});
