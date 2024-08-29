"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_fixture_builder_1 = require("@typestrong/fs-fixture-builder");
const internationalization_1 = require("../../../../lib/internationalization/internationalization");
const utils_1 = require("../../../../lib/utils");
const readers_1 = require("../../../../lib/utils/options/readers");
const TestLogger_1 = require("../../../TestLogger");
describe("Options - PackageJsonReader", () => {
    let optsContainer;
    let testLogger;
    beforeEach(() => {
        optsContainer = new utils_1.Options(new internationalization_1.Internationalization(null).proxy);
        testLogger = new TestLogger_1.TestLogger();
        optsContainer.addReader(new readers_1.PackageJsonReader());
    });
    it("Does not error if no package.json file is found", async () => {
        await optsContainer.read(testLogger, "/does-not-exist");
        testLogger.expectNoOtherMessages();
    });
    function testLogs(testTitle, pkgJsonContent, test) {
        it(testTitle, async () => {
            const proj = (0, fs_fixture_builder_1.project)(testTitle.replace(/[ "]/g, "_"));
            proj.addFile("package.json", pkgJsonContent);
            proj.write();
            after(() => proj.rm());
            await optsContainer.read(testLogger, proj.cwd);
            test(testLogger);
            testLogger.expectNoOtherMessages();
        });
    }
    testLogs(`Does not error if typedocOptions is not present`, `{ "name": "x" }`, () => { });
    testLogs(`Errors if the "typedocOptions" field is set but does not contain an object`, `{ "name": "x", "typedocOptions": 123 }`, (l) => l.expectMessage(`error: Failed to parse the "typedocOptions" field in */package.json, ensure it exists and contains an object`));
    testLogs("Errors if setting any option errors", `{ "name": "x", "typedocOptions": { "someOptionThatDoesNotExist": true } }`, (l) => l.expectMessage("error: Unknown option 'someOptionThatDoesNotExist' You may have meant:*"));
    testLogs("Warns if the legacy-packages 'typedoc' key is present", `{ "name": "x", "typedoc": {} }`, (l) => l.expectMessage("warn: The 'typedoc' key in */package.json was used by the legacy-packages entryPointStrategy and will be ignored"));
});
//# sourceMappingURL=package-json.test.js.map