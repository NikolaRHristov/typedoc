"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = require("assert");
const utils_1 = require("../../../lib/utils");
const help_1 = require("../../../lib/utils/options/help");
const internationalization_1 = require("../../../lib/internationalization/internationalization");
describe("Options - help", () => {
    const i18n = new internationalization_1.Internationalization(null).proxy;
    const options = new utils_1.Options(new internationalization_1.Internationalization(null).proxy);
    for (const decl of [
        { name: "td-option", help: "help", type: utils_1.ParameterType.String },
        { name: "td-option2", help: "help" },
        { name: "not displayed", help: "" },
        {
            name: "td",
            help: "help",
            hint: utils_1.ParameterHint.File,
        },
    ]) {
        options.addDeclaration(decl);
    }
    it("Describes TypeDoc options", () => {
        const help = (0, help_1.getOptionsHelp)(options, i18n);
        (0, assert_1.ok)(help.includes("td-option"));
    });
    it("Does not list options without help", () => {
        const help = (0, help_1.getOptionsHelp)(options, i18n);
        (0, assert_1.ok)(!help.includes("not displayed"));
    });
});
//# sourceMappingURL=help.test.js.map