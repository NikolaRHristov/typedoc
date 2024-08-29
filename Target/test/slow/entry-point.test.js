"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = require("assert");
const path_1 = require("path");
const fs_fixture_builder_1 = require("@typestrong/fs-fixture-builder");
const __1 = require("../..");
describe("Entry Points", () => {
    let fixture;
    let tsconfig;
    beforeEach(() => {
        fixture = (0, fs_fixture_builder_1.tempdirProject)();
        tsconfig = (0, path_1.join)(fixture.cwd, "tsconfig.json");
        fixture.addJsonFile("tsconfig.json", {
            include: ["."],
        });
        fixture.addJsonFile("package.json", {
            main: "index.ts",
        });
        fixture.addFile("index.ts", "export function fromIndex() {}");
        fixture.addFile("extra.ts", "export function extra() {}");
        fixture.write();
    });
    afterEach(() => {
        fixture.rm();
    });
    it("Supports expanding existing paths", async () => {
        const app = await __1.Application.bootstrap({
            tsconfig,
            entryPoints: [fixture.cwd],
            entryPointStrategy: __1.EntryPointStrategy.Expand,
        });
        const entryPoints = app.getEntryPoints();
        (0, assert_1.ok)(entryPoints);
        (0, assert_1.deepStrictEqual)(entryPoints.length, 2, "There are two files, so both should be expanded");
    });
    it("Supports expanding globs in paths", async () => {
        const app = await __1.Application.bootstrap({
            tsconfig,
            entryPoints: [`${fixture.cwd}/*.ts`],
            entryPointStrategy: __1.EntryPointStrategy.Expand,
        });
        const entryPoints = app.getEntryPoints();
        (0, assert_1.ok)(entryPoints);
        (0, assert_1.deepStrictEqual)(entryPoints.length, 2, "There are two files, so both should be expanded");
    });
    it("Supports resolving directories", async () => {
        const app = await __1.Application.bootstrap({
            tsconfig,
            entryPoints: [fixture.cwd],
            entryPointStrategy: __1.EntryPointStrategy.Resolve,
        });
        const entryPoints = app.getEntryPoints();
        (0, assert_1.ok)(entryPoints);
        (0, assert_1.deepStrictEqual)(entryPoints.length, 1, "entry-points/index.ts should have been the sole entry point");
    });
});
//# sourceMappingURL=entry-point.test.js.map