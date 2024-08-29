"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = require("assert");
const models_1 = require("../../lib/models");
const abstract_1 = require("../../lib/models/reflections/abstract");
const utils_1 = require("../../lib/utils");
const sort_1 = require("../../lib/utils/sort");
const internationalization_1 = require("../../lib/internationalization/internationalization");
const FileRegistry_1 = require("../../lib/models/FileRegistry");
describe("Sort", () => {
    function sortReflections(arr, strategies) {
        const opts = new utils_1.Options(new internationalization_1.Internationalization(null).proxy);
        opts.setValue("sort", strategies);
        (0, sort_1.getSortFunction)(opts)(arr);
    }
    it("Should sort by name", () => {
        const arr = [
            new models_1.DeclarationReflection("a", models_1.ReflectionKind.TypeAlias),
            new models_1.DeclarationReflection("c", models_1.ReflectionKind.TypeAlias),
            new models_1.DeclarationReflection("b", models_1.ReflectionKind.TypeAlias),
        ];
        sortReflections(arr, ["alphabetical"]);
        (0, assert_1.deepStrictEqual)(arr.map((r) => r.name), ["a", "b", "c"]);
    });
    it("Should sort by enum value ascending", () => {
        const arr = [
            new models_1.DeclarationReflection("a", models_1.ReflectionKind.EnumMember),
            new models_1.DeclarationReflection("b", models_1.ReflectionKind.EnumMember),
            new models_1.DeclarationReflection("c", models_1.ReflectionKind.EnumMember),
        ];
        arr[0].type = new models_1.LiteralType(123);
        arr[1].type = new models_1.LiteralType(12);
        arr[2].type = new models_1.LiteralType(3);
        sortReflections(arr, ["enum-value-ascending"]);
        (0, assert_1.deepStrictEqual)(arr.map((r) => r.name), ["c", "b", "a"]);
    });
    it("Should not sort enum value ascending if not an enum member", () => {
        const arr = [
            new models_1.DeclarationReflection("a", models_1.ReflectionKind.Function),
            new models_1.DeclarationReflection("b", models_1.ReflectionKind.EnumMember),
            new models_1.DeclarationReflection("c", models_1.ReflectionKind.EnumMember),
        ];
        arr[0].type = new models_1.LiteralType(123);
        arr[1].type = new models_1.LiteralType(12);
        arr[2].type = new models_1.LiteralType(3);
        sortReflections(arr, ["enum-value-ascending"]);
        (0, assert_1.deepStrictEqual)(arr.map((r) => r.name), ["a", "c", "b"]);
    });
    it("Should sort by enum value descending", () => {
        const arr = [
            new models_1.DeclarationReflection("a", models_1.ReflectionKind.EnumMember),
            new models_1.DeclarationReflection("b", models_1.ReflectionKind.EnumMember),
            new models_1.DeclarationReflection("c", models_1.ReflectionKind.EnumMember),
        ];
        arr[0].type = new models_1.LiteralType(123);
        arr[1].type = new models_1.LiteralType(12);
        arr[2].type = new models_1.LiteralType(3);
        sortReflections(arr, ["enum-value-descending"]);
        (0, assert_1.deepStrictEqual)(arr.map((r) => r.name), ["a", "b", "c"]);
    });
    it("Should not sort enum value descending if not an enum member", () => {
        const arr = [
            new models_1.DeclarationReflection("c", models_1.ReflectionKind.Function),
            new models_1.DeclarationReflection("a", models_1.ReflectionKind.EnumMember),
            new models_1.DeclarationReflection("b", models_1.ReflectionKind.EnumMember),
        ];
        arr[0].type = new models_1.LiteralType(123);
        arr[1].type = new models_1.LiteralType(-1);
        arr[2].type = new models_1.LiteralType(3);
        sortReflections(arr, ["enum-value-descending"]);
        (0, assert_1.deepStrictEqual)(arr.map((r) => r.name), ["c", "b", "a"]);
    });
    it("Should sort by static first", () => {
        const arr = [
            new models_1.DeclarationReflection("a", models_1.ReflectionKind.Function),
            new models_1.DeclarationReflection("b", models_1.ReflectionKind.Function),
            new models_1.DeclarationReflection("c", models_1.ReflectionKind.Function),
        ];
        arr[0].setFlag(models_1.ReflectionFlag.Static, true);
        arr[1].setFlag(models_1.ReflectionFlag.Static, false);
        arr[2].setFlag(models_1.ReflectionFlag.Static, true);
        sortReflections(arr, ["static-first"]);
        (0, assert_1.deepStrictEqual)(arr.map((r) => r.name), ["a", "c", "b"]);
    });
    it("Should sort by instance first", () => {
        const arr = [
            new models_1.DeclarationReflection("a", models_1.ReflectionKind.Function),
            new models_1.DeclarationReflection("b", models_1.ReflectionKind.Function),
            new models_1.DeclarationReflection("c", models_1.ReflectionKind.Function),
        ];
        arr[0].setFlag(models_1.ReflectionFlag.Static, true);
        arr[1].setFlag(models_1.ReflectionFlag.Static, false);
        arr[2].setFlag(models_1.ReflectionFlag.Static, true);
        sortReflections(arr, ["instance-first"]);
        (0, assert_1.deepStrictEqual)(arr.map((r) => r.name), ["b", "a", "c"]);
    });
    it("Should sort by visibility", () => {
        const arr = [
            new models_1.DeclarationReflection("a", models_1.ReflectionKind.Function),
            new models_1.DeclarationReflection("b", models_1.ReflectionKind.Function),
            new models_1.DeclarationReflection("c", models_1.ReflectionKind.Function),
            new models_1.DeclarationReflection("d", models_1.ReflectionKind.Function),
        ];
        arr[0].setFlag(models_1.ReflectionFlag.Protected, true);
        arr[1].setFlag(models_1.ReflectionFlag.Private, true);
        arr[2].setFlag(models_1.ReflectionFlag.Public, true);
        // This might not be set. If not set, assumed public.
        // arr[3].setFlag(ReflectionFlag.Public, true);
        sortReflections(arr, ["visibility"]);
        (0, assert_1.deepStrictEqual)(arr.map((r) => r.name), ["c", "d", "a", "b"]);
    });
    it("Should sort by required/optional", () => {
        const arr = [
            new models_1.DeclarationReflection("a", models_1.ReflectionKind.Property),
            new models_1.DeclarationReflection("b", models_1.ReflectionKind.Property),
        ];
        arr[0].setFlag(models_1.ReflectionFlag.Optional, true);
        arr[1].setFlag(models_1.ReflectionFlag.Optional, false);
        sortReflections(arr, ["required-first"]);
        (0, assert_1.deepStrictEqual)(arr.map((r) => r.name), ["b", "a"]);
    });
    it("Should sort by kind", () => {
        const arr = [
            new models_1.DeclarationReflection("1", models_1.ReflectionKind.Reference),
            new models_1.DeclarationReflection("23", models_1.ReflectionKind.SetSignature),
            new models_1.DeclarationReflection("3", models_1.ReflectionKind.Module),
            new models_1.DeclarationReflection("4", models_1.ReflectionKind.Namespace),
            new models_1.DeclarationReflection("5", models_1.ReflectionKind.Enum),
            new models_1.DeclarationReflection("6", models_1.ReflectionKind.EnumMember),
            new models_1.DeclarationReflection("15", models_1.ReflectionKind.Method),
            new models_1.DeclarationReflection("8", models_1.ReflectionKind.Interface),
            new models_1.DeclarationReflection("9", models_1.ReflectionKind.TypeAlias),
            new models_1.DeclarationReflection("10", models_1.ReflectionKind.Constructor),
            new models_1.DeclarationReflection("2", models_1.ReflectionKind.Project),
            new models_1.DeclarationReflection("22", models_1.ReflectionKind.GetSignature),
            new models_1.DeclarationReflection("12", models_1.ReflectionKind.Variable),
            new models_1.DeclarationReflection("13", models_1.ReflectionKind.Function),
            new models_1.DeclarationReflection("14", models_1.ReflectionKind.Accessor),
            new models_1.DeclarationReflection("11", models_1.ReflectionKind.Property),
            new models_1.DeclarationReflection("18", models_1.ReflectionKind.TypeLiteral),
            new models_1.DeclarationReflection("16", models_1.ReflectionKind.Parameter),
            new models_1.DeclarationReflection("17", models_1.ReflectionKind.TypeParameter),
            new models_1.DeclarationReflection("19", models_1.ReflectionKind.CallSignature),
            new models_1.DeclarationReflection("7", models_1.ReflectionKind.Class),
            new models_1.DeclarationReflection("20", models_1.ReflectionKind.ConstructorSignature),
            new models_1.DeclarationReflection("21", models_1.ReflectionKind.IndexSignature),
        ];
        sortReflections(arr, ["kind"]);
        (0, assert_1.deepStrictEqual)(arr.map((r) => r.name), Array.from({ length: arr.length }, (_, i) => (i + 1).toString()));
    });
    it("Should sort by external last", () => {
        const arr = [
            new models_1.DeclarationReflection("a", models_1.ReflectionKind.Function),
            new models_1.DeclarationReflection("b", models_1.ReflectionKind.Function),
            new models_1.DeclarationReflection("c", models_1.ReflectionKind.Function),
        ];
        arr[0].setFlag(models_1.ReflectionFlag.External, true);
        arr[1].setFlag(models_1.ReflectionFlag.External, false);
        arr[2].setFlag(models_1.ReflectionFlag.External, true);
        sortReflections(arr, ["external-last"]);
        (0, assert_1.deepStrictEqual)(arr.map((r) => r.name), ["b", "a", "c"]);
    });
    it("Should sort with multiple strategies", () => {
        (0, abstract_1.resetReflectionID)();
        const arr = [
            new models_1.DeclarationReflection("a", models_1.ReflectionKind.Function),
            new models_1.DeclarationReflection("a", models_1.ReflectionKind.Function),
            new models_1.DeclarationReflection("b", models_1.ReflectionKind.Function),
            new models_1.DeclarationReflection("b", models_1.ReflectionKind.Function),
        ];
        arr[0].setFlag(models_1.ReflectionFlag.Optional, true);
        arr[2].setFlag(models_1.ReflectionFlag.Optional, true);
        sortReflections(arr, ["required-first", "alphabetical"]);
        (0, assert_1.deepStrictEqual)(arr.map((r) => r.id), [1, 3, 0, 2]);
    });
    it("source-order should do nothing if no symbols are available", () => {
        const proj = new models_1.ProjectReflection("", new FileRegistry_1.FileRegistry());
        const arr = [
            new models_1.DeclarationReflection("b", models_1.ReflectionKind.Function, proj),
            new models_1.DeclarationReflection("a", models_1.ReflectionKind.Function, proj),
        ];
        sortReflections(arr, ["source-order", "alphabetical"]);
        (0, assert_1.deepStrictEqual)(arr.map((r) => r.name), ["a", "b"]);
    });
    it("source-order should sort by file, then by position in file", () => {
        const aId = new models_1.ReflectionSymbolId({
            sourceFileName: "a.ts",
            qualifiedName: "a",
        });
        aId.pos = 1;
        const bId = new models_1.ReflectionSymbolId({
            sourceFileName: "a.ts",
            qualifiedName: "b",
        });
        bId.pos = 2;
        const cId = new models_1.ReflectionSymbolId({
            sourceFileName: "b.ts",
            qualifiedName: "c",
        });
        cId.pos = 0;
        const proj = new models_1.ProjectReflection("", new FileRegistry_1.FileRegistry());
        const a = new models_1.DeclarationReflection("a", models_1.ReflectionKind.Variable, proj);
        proj.registerSymbolId(a, aId);
        const b = new models_1.DeclarationReflection("b", models_1.ReflectionKind.Variable, proj);
        proj.registerSymbolId(b, bId);
        const c = new models_1.DeclarationReflection("c", models_1.ReflectionKind.Variable, proj);
        proj.registerSymbolId(c, cId);
        const arr = [c, b, a];
        sortReflections(arr, ["source-order"]);
        (0, assert_1.deepStrictEqual)(arr.map((r) => r.name), ["a", "b", "c"]);
    });
    it("enum-member-source-order should do nothing if not an enum member", () => {
        const bId = new models_1.ReflectionSymbolId({
            sourceFileName: "a.ts",
            qualifiedName: "b",
        });
        bId.pos = 2;
        const cId = new models_1.ReflectionSymbolId({
            sourceFileName: "a.ts",
            qualifiedName: "c",
        });
        cId.pos = 1;
        const proj = new models_1.ProjectReflection("", new FileRegistry_1.FileRegistry());
        const a = new models_1.DeclarationReflection("a", models_1.ReflectionKind.Variable, proj);
        const b = new models_1.DeclarationReflection("b", models_1.ReflectionKind.EnumMember, proj);
        proj.registerSymbolId(b, bId);
        const c = new models_1.DeclarationReflection("c", models_1.ReflectionKind.EnumMember, proj);
        proj.registerSymbolId(c, cId);
        const d = new models_1.DeclarationReflection("d", models_1.ReflectionKind.Variable, proj);
        const arr = [d, c, b, a];
        sortReflections(arr, ["enum-member-source-order", "alphabetical"]);
        (0, assert_1.deepStrictEqual)(arr.map((r) => r.name), ["a", "c", "b", "d"]);
    });
    it("Should handle documents-first ordering", () => {
        const proj = new models_1.ProjectReflection("", new FileRegistry_1.FileRegistry());
        const a = new models_1.DocumentReflection("a", proj, [], {});
        const b = new models_1.DocumentReflection("b", proj, [], {});
        const c = new models_1.DeclarationReflection("c", models_1.ReflectionKind.Class, proj);
        const arr = [a, b, c];
        sortReflections(arr, ["documents-first", "alphabetical"]);
        (0, assert_1.deepStrictEqual)(arr.map((r) => r.name), ["a", "b", "c"]);
        const arr2 = [c, b, a];
        sortReflections(arr2, ["documents-first", "alphabetical"]);
        (0, assert_1.deepStrictEqual)(arr2.map((r) => r.name), ["a", "b", "c"]);
    });
    it("Should handle documents-last ordering", () => {
        const proj = new models_1.ProjectReflection("", new FileRegistry_1.FileRegistry());
        const a = new models_1.DocumentReflection("a", proj, [], {});
        const b = new models_1.DocumentReflection("b", proj, [], {});
        const c = new models_1.DeclarationReflection("c", models_1.ReflectionKind.Class, proj);
        const arr = [a, b, c];
        sortReflections(arr, ["documents-last", "alphabetical"]);
        (0, assert_1.deepStrictEqual)(arr.map((r) => r.name), ["c", "a", "b"]);
        const arr2 = [a, c, b];
        sortReflections(arr2, ["documents-last", "alphabetical"]);
        (0, assert_1.deepStrictEqual)(arr2.map((r) => r.name), ["c", "a", "b"]);
    });
});
//# sourceMappingURL=sort.test.js.map