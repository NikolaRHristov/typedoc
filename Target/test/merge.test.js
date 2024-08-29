"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = require("assert");
const path_1 = require("path");
const index_1 = require("../index");
const programs_1 = require("./programs");
const TestLogger_1 = require("./TestLogger");
const base = (0, programs_1.getConverterBase)();
describe("Merging projects", () => {
    it("Handles multiple projects", async () => {
        const app = await index_1.Application.bootstrap({
            entryPointStrategy: index_1.EntryPointStrategy.Merge,
            entryPoints: [
                (0, path_1.join)(base, "alias/specs.json"),
                (0, path_1.join)(base, "class/*specs.json"),
            ],
        });
        const logger = new TestLogger_1.TestLogger();
        app.logger = logger;
        const project = await app.convert();
        logger.expectNoOtherMessages();
        (0, assert_1.deepStrictEqual)(project?.name, "typedoc");
        (0, assert_1.deepStrictEqual)(project.children?.map((c) => c.name), ["alias", "class"]);
        const crossRef = project.getChildByName("alias.MergedCrossReference");
        const testClass = project.getChildByName("class.class.TestClass");
        (0, assert_1.ok)(testClass, "Missing test class");
        (0, assert_1.ok)(crossRef, "Missing MergedCrossReference");
        (0, assert_1.ok)(crossRef.type instanceof index_1.ReferenceType);
        (0, assert_1.ok)(testClass === crossRef.type.reflection, "Cross project reference did not work");
        const link = crossRef.comment?.summary[0];
        (0, assert_1.deepStrictEqual)(link?.kind, "inline-tag");
        (0, assert_1.deepStrictEqual)(link.target, testClass, "Cross project link did not work");
    });
});
