"use strict";
var __createBinding =
	(this && this.__createBinding) ||
	(Object.create
		? function (o, m, k, k2) {
				if (k2 === undefined) k2 = k;
				var desc = Object.getOwnPropertyDescriptor(m, k);
				if (
					!desc ||
					("get" in desc
						? !m.__esModule
						: desc.writable || desc.configurable)
				) {
					desc = {
						enumerable: true,
						get: function () {
							return m[k];
						},
					};
				}
				Object.defineProperty(o, k2, desc);
			}
		: function (o, m, k, k2) {
				if (k2 === undefined) k2 = k;
				o[k2] = m[k];
			});
var __setModuleDefault =
	(this && this.__setModuleDefault) ||
	(Object.create
		? function (o, v) {
				Object.defineProperty(o, "default", {
					enumerable: true,
					value: v,
				});
			}
		: function (o, v) {
				o["default"] = v;
			});
var __importStar =
	(this && this.__importStar) ||
	function (mod) {
		if (mod && mod.__esModule) return mod;
		var result = {};
		if (mod != null)
			for (var k in mod)
				if (
					k !== "default" &&
					Object.prototype.hasOwnProperty.call(mod, k)
				)
					__createBinding(result, mod, k);
		__setModuleDefault(result, mod);
		return result;
	};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = require("assert");
const fs = __importStar(require("fs"));
const net_1 = require("net");
const path_1 = require("path");
const fs_fixture_builder_1 = require("@typestrong/fs-fixture-builder");
const fs_1 = require("../../lib/utils/fs");
describe("fs.ts", () => {
	describe("getCommonDirectory", () => {
		it("Returns the empty string if no files are provided", () => {
			(0, assert_1.deepStrictEqual)((0, fs_1.getCommonDirectory)([]), "");
		});
		it("Returns the dirname if only one file is provided", () => {
			(0, assert_1.deepStrictEqual)(
				(0, fs_1.getCommonDirectory)(["a/b/c.ts"]),
				"a/b",
			);
		});
		it("Handles duplicates paths appropriately", () => {
			const p = "a/b/c";
			(0, assert_1.deepStrictEqual)(
				(0, fs_1.getCommonDirectory)([p, p]),
				p,
			);
		});
		it("Gets the path common to all files", () => {
			(0, assert_1.deepStrictEqual)(
				(0, fs_1.getCommonDirectory)([
					"/a/b/c",
					"/a/b/c/d/e",
					"/a/b/d",
				]),
				"/a/b",
			);
		});
	});
	describe("glob", () => {
		let fix;
		beforeEach(() => {
			fix = (0, fs_fixture_builder_1.tempdirProject)();
		});
		afterEach(() => {
			fix.rm();
		});
		it("handles root match", () => {
			fix.write();
			const result = (0, fs_1.glob)(fix.cwd, fix.cwd, {
				includeDirectories: true,
			});
			(0, assert_1.deepStrictEqual)(
				result.map(path_1.normalize),
				[fix.cwd].map(path_1.normalize),
			);
		});
		it("Handles basic globbing", () => {
			fix.addFile("test.ts");
			fix.addFile("test2.ts");
			fix.addFile("a.ts");
			fix.addFile("b.js");
			fix.write();
			(0, assert_1.deepStrictEqual)(
				(0, fs_1.glob)(`${fix.cwd}/*.ts`, fix.cwd).map((f) =>
					(0, path_1.basename)(f),
				),
				["a.ts", "test.ts", "test2.ts"],
			);
			(0, assert_1.deepStrictEqual)(
				(0, fs_1.glob)(`**/test*.ts`, fix.cwd).map((f) =>
					(0, path_1.basename)(f),
				),
				["test.ts", "test2.ts"],
			);
		});
		describe("when 'followSymlinks' option is true", () => {
			it("should navigate symlinked directories", () => {
				const target = (0, path_1.dirname)(
					fix.dir("a").addFile("test.ts").path,
				);
				fix.write();
				fs.symlinkSync(
					target,
					(0, path_1.resolve)(fix.cwd, "b"),
					"junction",
				);
				(0, assert_1.deepStrictEqual)(
					(0, fs_1.glob)(`${fix.cwd}/b/*.ts`, fix.cwd, {
						followSymlinks: true,
					}).map((f) => (0, path_1.basename)(f)),
					["test.ts"],
				);
			});
			it("should navigate recursive symlinked directories only once", () => {
				fix.addFile("test.ts");
				fix.write();
				fs.symlinkSync(
					fix.cwd,
					(0, path_1.resolve)(fix.cwd, "recursive"),
					"junction",
				);
				(0, assert_1.deepStrictEqual)(
					(0, fs_1.glob)(`${fix.cwd}/**/*.ts`, fix.cwd, {
						followSymlinks: true,
					}).map((f) => (0, path_1.basename)(f)),
					["test.ts", "test.ts"],
				);
			});
			it("should handle symlinked files", function () {
				const { path } = fix.addFile("test.ts");
				fix.write();
				try {
					fs.symlinkSync(
						path,
						(0, path_1.resolve)(
							(0, path_1.dirname)(path),
							"test-2.ts",
						),
						"file",
					);
				} catch (err) {
					// on windows, you need elevated permissions to create a file symlink.
					// maybe we have them! maybe we don't!
					if (err.code === "EPERM" && process.platform === "win32") {
						return this.skip();
					}
				}
				(0, assert_1.deepStrictEqual)(
					(0, fs_1.glob)(`${fix.cwd}/**/*.ts`, fix.cwd, {
						followSymlinks: true,
					}).map((f) => (0, path_1.basename)(f)),
					["test-2.ts", "test.ts"],
				);
			});
		});
		describe("when node_modules is present in the pattern", function () {
			it("should traverse node_modules", function () {
				fix.dir("node_modules").addFile("test.ts");
				fix.write();
				(0, assert_1.deepStrictEqual)(
					(0, fs_1.glob)(
						`${fix.cwd}/node_modules/test.ts`,
						fix.cwd,
					).map((f) => (0, path_1.basename)(f)),
					["test.ts"],
				);
			});
		});
		describe("when node_modules is not present in the pattern", function () {
			it("should not traverse node_modules", function () {
				fix.dir("node_modules").addFile("test.ts");
				fix.write();
				(0, assert_1.deepStrictEqual)(
					(0, fs_1.glob)(`${fix.cwd}/**/test.ts`, fix.cwd).map((f) =>
						(0, path_1.basename)(f),
					),
					[],
				);
			});
		});
		it("should ignore anything that is not a file, symbolic link, or directory", function (done) {
			// Use unix socket for example, because that's easiest to create.
			// Skip on Windows because it doesn't support unix sockets
			if (process.platform === "win32") {
				return this.skip();
			}
			fix.write();
			const sockServer = (0, net_1.createServer)()
				.unref()
				.listen((0, path_1.resolve)(fix.cwd, "socket.sock"))
				.once("listening", () => {
					let err = null;
					try {
						(0, assert_1.deepStrictEqual)(
							(0, fs_1.glob)(`${fix.cwd}/*.sock`, fix.cwd),
							[],
						);
					} catch (e) {
						err = e;
					} finally {
						sockServer.close(() => {
							done(err);
						});
					}
				});
		});
	});
});
