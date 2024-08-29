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
var __exportStar =
	(this && this.__exportStar) ||
	function (m, exports) {
		for (var p in m)
			if (
				p !== "default" &&
				!Object.prototype.hasOwnProperty.call(exports, p)
			)
				__createBinding(exports, m, p);
	};
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
exports.MinimalSourceFile =
	exports.Validation =
	exports.renderElement =
	exports.Raw =
	exports.Fragment =
	exports.JSX =
	exports.EventHooks =
	exports.getSortFunction =
	exports.loadPlugins =
	exports.OptionDefaults =
	exports.TypeDocReader =
	exports.TSConfigReader =
	exports.ParameterType =
	exports.ParameterHint =
	exports.PackageJsonReader =
	exports.Options =
	exports.CommentStyle =
	exports.Option =
	exports.ArgumentsReader =
	exports.DefaultMap =
	exports.LogLevel =
	exports.Logger =
	exports.ConsoleLogger =
	exports.assertNever =
	exports.normalizePath =
	exports.discoverPackageJson =
	exports.discoverInParentDir =
	exports.writeFileSync =
	exports.writeFile =
	exports.readFile =
	exports.getCommonDirectory =
	exports.copySync =
	exports.copy =
	exports.isFile =
	exports.EventDispatcher =
	exports.Component =
	exports.ChildableComponent =
	exports.AbstractComponent =
	exports.unique =
	exports.removeIfPresent =
	exports.removeIf =
	exports.partition =
	exports.insertPrioritySorted =
	exports.filterMap =
		void 0;
var array_1 = require("./array");
Object.defineProperty(exports, "filterMap", {
	enumerable: true,
	get: function () {
		return array_1.filterMap;
	},
});
Object.defineProperty(exports, "insertPrioritySorted", {
	enumerable: true,
	get: function () {
		return array_1.insertPrioritySorted;
	},
});
Object.defineProperty(exports, "partition", {
	enumerable: true,
	get: function () {
		return array_1.partition;
	},
});
Object.defineProperty(exports, "removeIf", {
	enumerable: true,
	get: function () {
		return array_1.removeIf;
	},
});
Object.defineProperty(exports, "removeIfPresent", {
	enumerable: true,
	get: function () {
		return array_1.removeIfPresent;
	},
});
Object.defineProperty(exports, "unique", {
	enumerable: true,
	get: function () {
		return array_1.unique;
	},
});
var component_1 = require("./component");
Object.defineProperty(exports, "AbstractComponent", {
	enumerable: true,
	get: function () {
		return component_1.AbstractComponent;
	},
});
Object.defineProperty(exports, "ChildableComponent", {
	enumerable: true,
	get: function () {
		return component_1.ChildableComponent;
	},
});
Object.defineProperty(exports, "Component", {
	enumerable: true,
	get: function () {
		return component_1.Component;
	},
});
__exportStar(require("./enum"), exports);
var events_1 = require("./events");
Object.defineProperty(exports, "EventDispatcher", {
	enumerable: true,
	get: function () {
		return events_1.EventDispatcher;
	},
});
var fs_1 = require("./fs");
Object.defineProperty(exports, "isFile", {
	enumerable: true,
	get: function () {
		return fs_1.isFile;
	},
});
Object.defineProperty(exports, "copy", {
	enumerable: true,
	get: function () {
		return fs_1.copy;
	},
});
Object.defineProperty(exports, "copySync", {
	enumerable: true,
	get: function () {
		return fs_1.copySync;
	},
});
Object.defineProperty(exports, "getCommonDirectory", {
	enumerable: true,
	get: function () {
		return fs_1.getCommonDirectory;
	},
});
Object.defineProperty(exports, "readFile", {
	enumerable: true,
	get: function () {
		return fs_1.readFile;
	},
});
Object.defineProperty(exports, "writeFile", {
	enumerable: true,
	get: function () {
		return fs_1.writeFile;
	},
});
Object.defineProperty(exports, "writeFileSync", {
	enumerable: true,
	get: function () {
		return fs_1.writeFileSync;
	},
});
Object.defineProperty(exports, "discoverInParentDir", {
	enumerable: true,
	get: function () {
		return fs_1.discoverInParentDir;
	},
});
Object.defineProperty(exports, "discoverPackageJson", {
	enumerable: true,
	get: function () {
		return fs_1.discoverPackageJson;
	},
});
var paths_1 = require("./paths");
Object.defineProperty(exports, "normalizePath", {
	enumerable: true,
	get: function () {
		return paths_1.normalizePath;
	},
});
var general_1 = require("./general");
Object.defineProperty(exports, "assertNever", {
	enumerable: true,
	get: function () {
		return general_1.assertNever;
	},
});
var loggers_1 = require("./loggers");
Object.defineProperty(exports, "ConsoleLogger", {
	enumerable: true,
	get: function () {
		return loggers_1.ConsoleLogger;
	},
});
Object.defineProperty(exports, "Logger", {
	enumerable: true,
	get: function () {
		return loggers_1.Logger;
	},
});
Object.defineProperty(exports, "LogLevel", {
	enumerable: true,
	get: function () {
		return loggers_1.LogLevel;
	},
});
var map_1 = require("./map");
Object.defineProperty(exports, "DefaultMap", {
	enumerable: true,
	get: function () {
		return map_1.DefaultMap;
	},
});
var options_1 = require("./options");
Object.defineProperty(exports, "ArgumentsReader", {
	enumerable: true,
	get: function () {
		return options_1.ArgumentsReader;
	},
});
Object.defineProperty(exports, "Option", {
	enumerable: true,
	get: function () {
		return options_1.Option;
	},
});
Object.defineProperty(exports, "CommentStyle", {
	enumerable: true,
	get: function () {
		return options_1.CommentStyle;
	},
});
Object.defineProperty(exports, "Options", {
	enumerable: true,
	get: function () {
		return options_1.Options;
	},
});
Object.defineProperty(exports, "PackageJsonReader", {
	enumerable: true,
	get: function () {
		return options_1.PackageJsonReader;
	},
});
Object.defineProperty(exports, "ParameterHint", {
	enumerable: true,
	get: function () {
		return options_1.ParameterHint;
	},
});
Object.defineProperty(exports, "ParameterType", {
	enumerable: true,
	get: function () {
		return options_1.ParameterType;
	},
});
Object.defineProperty(exports, "TSConfigReader", {
	enumerable: true,
	get: function () {
		return options_1.TSConfigReader;
	},
});
Object.defineProperty(exports, "TypeDocReader", {
	enumerable: true,
	get: function () {
		return options_1.TypeDocReader;
	},
});
Object.defineProperty(exports, "OptionDefaults", {
	enumerable: true,
	get: function () {
		return options_1.OptionDefaults;
	},
});
var plugins_1 = require("./plugins");
Object.defineProperty(exports, "loadPlugins", {
	enumerable: true,
	get: function () {
		return plugins_1.loadPlugins;
	},
});
var sort_1 = require("./sort");
Object.defineProperty(exports, "getSortFunction", {
	enumerable: true,
	get: function () {
		return sort_1.getSortFunction;
	},
});
var hooks_1 = require("./hooks");
Object.defineProperty(exports, "EventHooks", {
	enumerable: true,
	get: function () {
		return hooks_1.EventHooks;
	},
});
__exportStar(require("./entry-point"), exports);
const JSX = __importStar(require("./jsx"));
exports.JSX = JSX;
var jsx_1 = require("./jsx");
Object.defineProperty(exports, "Fragment", {
	enumerable: true,
	get: function () {
		return jsx_1.Fragment;
	},
});
Object.defineProperty(exports, "Raw", {
	enumerable: true,
	get: function () {
		return jsx_1.Raw;
	},
});
Object.defineProperty(exports, "renderElement", {
	enumerable: true,
	get: function () {
		return jsx_1.renderElement;
	},
});
exports.Validation = __importStar(require("./validation"));
__exportStar(require("./tsutils"), exports);
var minimalSourceFile_1 = require("./minimalSourceFile");
Object.defineProperty(exports, "MinimalSourceFile", {
	enumerable: true,
	get: function () {
		return minimalSourceFile_1.MinimalSourceFile;
	},
});
