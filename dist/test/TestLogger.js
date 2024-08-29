"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestLogger = void 0;
const utils_1 = require("../lib/utils");
const assert_1 = require("assert");
const typescript_1 = __importDefault(require("typescript"));
const path_1 = require("path");
const internationalization_1 = require("../lib/internationalization/internationalization");
const levelMap = {
    [utils_1.LogLevel.None]: "none: ",
    [utils_1.LogLevel.Error]: "error: ",
    [utils_1.LogLevel.Warn]: "warn: ",
    [utils_1.LogLevel.Info]: "info: ",
    [utils_1.LogLevel.Verbose]: "debug: ",
};
class TestLogger extends utils_1.Logger {
    constructor() {
        super(...arguments);
        this.messages = [];
        this.i18n = new internationalization_1.Internationalization(null).proxy;
    }
    reset() {
        this.resetErrors();
        this.resetWarnings();
        this.messages = [];
    }
    expectMessage(message) {
        const regex = createRegex(message);
        const index = this.messages.findIndex((m) => regex.test(m));
        if (index === -1) {
            const messages = this.messages.join("\n\t") || "(none logged)";
            (0, assert_1.fail)(`Expected "${message}" to be logged. The logged messages were:\n\t${messages}`);
        }
        this.messages.splice(index, 1);
    }
    expectNoMessage(message) {
        const regex = createRegex(message);
        const index = this.messages.findIndex((m) => regex.test(m));
        if (index !== -1) {
            const messages = this.messages.join("\n\t");
            (0, assert_1.fail)(`Expected "${message}" to not be logged. The logged messages were:\n\t${messages}`);
        }
    }
    expectNoOtherMessages({ ignoreDebug } = { ignoreDebug: true }) {
        const messages = ignoreDebug
            ? this.messages.filter((msg) => !msg.startsWith("debug"))
            : this.messages;
        (0, assert_1.ok)(messages.length === 0, `Expected no other messages to be logged. The logged messages were:\n\t${this.messages.join("\n\t")}`);
    }
    diagnostic(diagnostic) {
        const output = typescript_1.default.formatDiagnostic(diagnostic, {
            getCanonicalFileName: path_1.resolve,
            getCurrentDirectory: () => process.cwd(),
            getNewLine: () => typescript_1.default.sys.newLine,
        });
        switch (diagnostic.category) {
            case typescript_1.default.DiagnosticCategory.Error:
                this.log(output, utils_1.LogLevel.Error);
                break;
            case typescript_1.default.DiagnosticCategory.Warning:
                this.log(output, utils_1.LogLevel.Warn);
                break;
            case typescript_1.default.DiagnosticCategory.Message:
                this.log(output, utils_1.LogLevel.Info);
        }
    }
    log(message, level) {
        super.log(message, level);
        this.messages.push(levelMap[level] + message);
    }
}
exports.TestLogger = TestLogger;
function createRegex(s) {
    return new RegExp([
        "^",
        s.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/\*/g, "[\\s\\S]*"),
        "$",
    ].join(""));
}
//# sourceMappingURL=TestLogger.js.map