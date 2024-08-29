"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = require("assert");
const models_1 = require("../../lib/models");
describe("ProjectReflection", () => {
    it("getReflectionById works with the project ID", () => {
        const project = new models_1.ProjectReflection("", new models_1.FileRegistry());
        (0, assert_1.ok)(project === project.getReflectionById(project.id));
    });
});
