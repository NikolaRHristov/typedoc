"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConverterBase = getConverterBase;
exports.getConverterApp = getConverterApp;
exports.getConverterProgram = getConverterProgram;
exports.getConverter2Base = getConverter2Base;
exports.getConverter2App = getConverter2App;
exports.getConverter2Program = getConverter2Program;
const assert_1 = require("assert");
const path_1 = require("path");
const typescript_1 = __importDefault(require("typescript"));
const __1 = require("..");
const application_1 = require("../lib/application");
let converterApp;
let converterProgram;
let converter2App;
let converter2Program;
function getConverterBase() {
    return (0, path_1.join)(process.cwd(), "src/test/converter");
}
function getConverterApp() {
    if (!converterApp) {
        converterApp = (0, application_1.createAppForTesting)();
        for (const [name, value] of Object.entries({
            name: "typedoc",
            excludeExternals: true,
            disableSources: false,
            excludePrivate: false,
            tsconfig: (0, path_1.join)(getConverterBase(), "tsconfig.json"),
            externalPattern: ["**/node_modules/**"],
            plugin: [],
            entryPointStrategy: __1.EntryPointStrategy.Expand,
            gitRevision: "fake",
            readme: "none",
        })) {
            converterApp.options.setValue(name, value);
        }
        new __1.TSConfigReader().read(converterApp.options, converterApp.logger, process.cwd());
        converterApp.serializer.addSerializer({
            priority: -1,
            supports(obj) {
                return obj instanceof __1.SourceReference;
            },
            toObject(ref, obj, _serializer) {
                if (obj.url) {
                    obj.url = `typedoc://${obj.url.substring(obj.url.indexOf(ref.fileName))}`;
                }
                return obj;
            },
        });
        converterApp.serializer.addSerializer({
            priority: -1,
            supports(obj) {
                return obj instanceof __1.ProjectReflection;
            },
            toObject(_refl, obj) {
                delete obj.packageVersion;
                return obj;
            },
        });
    }
    return converterApp;
}
function getConverterProgram() {
    if (!converterProgram) {
        const app = getConverterApp();
        converterProgram = typescript_1.default.createProgram(app.options.getFileNames(), app.options.getCompilerOptions());
        const errors = typescript_1.default.getPreEmitDiagnostics(converterProgram);
        (0, assert_1.deepStrictEqual)(errors, []);
    }
    return converterProgram;
}
function getConverter2Base() {
    return (0, path_1.join)(process.cwd(), "src/test/converter2");
}
function getConverter2App() {
    if (!converter2App) {
        converter2App = (0, application_1.createAppForTesting)();
        for (const [name, value] of Object.entries({
            excludeExternals: true,
            tsconfig: (0, path_1.join)(getConverter2Base(), "tsconfig.json"),
            validation: true,
        })) {
            converter2App.options.setValue(name, value);
        }
        new __1.TSConfigReader().read(converter2App.options, converter2App.logger, process.cwd());
    }
    return converter2App;
}
function getConverter2Program() {
    if (!converter2Program) {
        const app = getConverter2App();
        converter2Program = typescript_1.default.createProgram(app.options.getFileNames(), app.options.getCompilerOptions());
        const errors = typescript_1.default.getPreEmitDiagnostics(converter2Program);
        app.logger.diagnostics(errors);
        (0, assert_1.deepStrictEqual)(errors.length, 0);
    }
    return converter2Program;
}
//# sourceMappingURL=programs.js.map