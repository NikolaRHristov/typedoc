"use strict";
var __addDisposableResource =
	(this && this.__addDisposableResource) ||
	function (env, value, async) {
		if (value !== null && value !== void 0) {
			if (typeof value !== "object" && typeof value !== "function")
				throw new TypeError("Object expected.");
			var dispose, inner;
			if (async) {
				if (!Symbol.asyncDispose)
					throw new TypeError("Symbol.asyncDispose is not defined.");
				dispose = value[Symbol.asyncDispose];
			}
			if (dispose === void 0) {
				if (!Symbol.dispose)
					throw new TypeError("Symbol.dispose is not defined.");
				dispose = value[Symbol.dispose];
				if (async) inner = dispose;
			}
			if (typeof dispose !== "function")
				throw new TypeError("Object not disposable.");
			if (inner)
				dispose = function () {
					try {
						inner.call(this);
					} catch (e) {
						return Promise.reject(e);
					}
				};
			env.stack.push({ value: value, dispose: dispose, async: async });
		} else if (async) {
			env.stack.push({ async: true });
		}
		return value;
	};
var __disposeResources =
	(this && this.__disposeResources) ||
	(function (SuppressedError) {
		return function (env) {
			function fail(e) {
				env.error = env.hasError
					? new SuppressedError(
							e,
							env.error,
							"An error was suppressed during disposal.",
						)
					: e;
				env.hasError = true;
			}
			function next() {
				while (env.stack.length) {
					var rec = env.stack.pop();
					try {
						var result = rec.dispose && rec.dispose.call(rec.value);
						if (rec.async)
							return Promise.resolve(result).then(
								next,
								function (e) {
									fail(e);
									return next();
								},
							);
					} catch (e) {
						fail(e);
					}
				}
				if (env.hasError) throw env.error;
			}
			return next();
		};
	})(
		typeof SuppressedError === "function"
			? SuppressedError
			: function (error, suppressed, message) {
					var e = new Error(message);
					return (
						(e.name = "SuppressedError"),
						(e.error = error),
						(e.suppressed = suppressed),
						e
					);
				},
	);
Object.defineProperty(exports, "__esModule", { value: true });
const fs_fixture_builder_1 = require("@typestrong/fs-fixture-builder");
const plugins_1 = require("../../lib/utils/plugins");
const TestLogger_1 = require("../TestLogger");
const path_1 = require("path");
const internationalization_1 = require("../../lib/internationalization/internationalization");
describe("loadPlugins", () => {
	let logger;
	const fakeApp = {
		i18n: new internationalization_1.Internationalization(null).proxy,
	};
	beforeEach(() => {
		logger = fakeApp.logger = new TestLogger_1.TestLogger();
	});
	it("Should support loading a basic plugin", async () => {
		const env_1 = { stack: [], error: void 0, hasError: false };
		try {
			const project = __addDisposableResource(
				env_1,
				(0, fs_fixture_builder_1.tempdirProject)(),
				false,
			);
			project.addJsonFile("package.json", {
				type: "commonjs",
				main: "index.js",
			});
			project.addFile("index.js", "exports.load = function load() {}");
			project.write();
			const plugin = (0, path_1.resolve)(project.cwd);
			await (0, plugins_1.loadPlugins)(fakeApp, [plugin]);
			logger.expectMessage(`info: Loaded plugin ${plugin}`);
		} catch (e_1) {
			env_1.error = e_1;
			env_1.hasError = true;
		} finally {
			__disposeResources(env_1);
		}
	});
	it("Should support loading a ESM plugin", async () => {
		const env_2 = { stack: [], error: void 0, hasError: false };
		try {
			const project = __addDisposableResource(
				env_2,
				(0, fs_fixture_builder_1.tempdirProject)(),
				false,
			);
			project.addJsonFile("package.json", {
				type: "module",
				main: "index.js",
			});
			project.addFile("index.js", "export function load() {}");
			project.write();
			const plugin = (0, path_1.join)(
				(0, path_1.resolve)(project.cwd),
				"index.js",
			);
			await (0, plugins_1.loadPlugins)(fakeApp, [plugin]);
			logger.expectMessage(`info: Loaded plugin ${plugin}`);
		} catch (e_2) {
			env_2.error = e_2;
			env_2.hasError = true;
		} finally {
			__disposeResources(env_2);
		}
	});
	it("Should handle errors when requiring plugins", async () => {
		const env_3 = { stack: [], error: void 0, hasError: false };
		try {
			const project = __addDisposableResource(
				env_3,
				(0, fs_fixture_builder_1.tempdirProject)(),
				false,
			);
			project.addJsonFile("package.json", {
				type: "commonjs",
				main: "index.js",
			});
			project.addFile("index.js", "throw Error('bad')");
			project.write();
			const plugin = (0, path_1.join)(
				(0, path_1.resolve)(project.cwd),
				"index.js",
			);
			await (0, plugins_1.loadPlugins)(fakeApp, [plugin]);
			logger.expectMessage(
				`error: The plugin ${plugin} could not be loaded`,
			);
		} catch (e_3) {
			env_3.error = e_3;
			env_3.hasError = true;
		} finally {
			__disposeResources(env_3);
		}
	});
	it("Should handle errors when loading plugins", async () => {
		const env_4 = { stack: [], error: void 0, hasError: false };
		try {
			const project = __addDisposableResource(
				env_4,
				(0, fs_fixture_builder_1.tempdirProject)(),
				false,
			);
			project.addJsonFile("package.json", {
				type: "commonjs",
				main: "index.js",
			});
			project.addFile(
				"index.js",
				"exports.load = function load() { throw Error('bad') }",
			);
			project.write();
			const plugin = (0, path_1.join)(
				(0, path_1.resolve)(project.cwd),
				"index.js",
			);
			await (0, plugins_1.loadPlugins)(fakeApp, [plugin]);
			logger.expectMessage(
				`error: The plugin ${plugin} could not be loaded`,
			);
		} catch (e_4) {
			env_4.error = e_4;
			env_4.hasError = true;
		} finally {
			__disposeResources(env_4);
		}
	});
	it("Should handle plugins without a load method", async () => {
		const env_5 = { stack: [], error: void 0, hasError: false };
		try {
			const project = __addDisposableResource(
				env_5,
				(0, fs_fixture_builder_1.tempdirProject)(),
				false,
			);
			project.addJsonFile("package.json", {
				type: "commonjs",
				main: "index.js",
			});
			project.addFile("index.js", "");
			project.write();
			const plugin = (0, path_1.join)(
				(0, path_1.resolve)(project.cwd),
				"index.js",
			);
			await (0, plugins_1.loadPlugins)(fakeApp, [plugin]);
			logger.expectMessage(
				`error: Invalid structure in plugin ${plugin}, no load function found`,
			);
		} catch (e_5) {
			env_5.error = e_5;
			env_5.hasError = true;
		} finally {
			__disposeResources(env_5);
		}
	});
});
