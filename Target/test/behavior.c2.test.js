"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = require("assert");
const fs_1 = require("fs");
const path_1 = require("path");
const comments_1 = require("../lib/converter/comments");
const models_1 = require("../lib/models");
const utils_1 = require("../lib/utils");
const declaration_1 = require("../lib/utils/options/declaration");
const programs_1 = require("./programs");
const TestLogger_1 = require("./TestLogger");
const utils_2 = require("./utils");
function buildNameTree(refl, tree = {}) {
    for (const child of refl.children || []) {
        tree[child.name] ||= {};
        buildNameTree(child, tree[child.name]);
    }
    return tree;
}
function getLinks(refl) {
    (0, assert_1.ok)(refl.comment);
    return (0, utils_1.filterMap)(refl.comment.summary, (p) => {
        if (p.kind === "inline-tag" && p.tag === "@link") {
            if (typeof p.target === "string") {
                return p.target;
            }
            if (p.target instanceof models_1.SignatureReflection) {
                return [
                    p.target.getFullName(),
                    p.target.parent.signatures?.indexOf(p.target),
                ];
            }
            if (p.target instanceof models_1.Reflection) {
                return [p.target.kind, p.target.getFullName()];
            }
            return [p.target?.qualifiedName];
        }
    });
}
function getLinkTexts(refl) {
    (0, assert_1.ok)(refl.comment);
    return (0, utils_1.filterMap)(refl.comment.summary, (p) => {
        if (p.kind === "inline-tag" && p.tag === "@link") {
            return p.text;
        }
    });
}
const base = (0, programs_1.getConverter2Base)();
const app = (0, programs_1.getConverter2App)();
const program = (0, programs_1.getConverter2Program)();
function convert(...entries) {
    const entryPoints = entries.map((entry) => {
        const entryPoint = [
            (0, path_1.join)(base, `behavior/${entry}.ts`),
            (0, path_1.join)(base, `behavior/${entry}.d.ts`),
            (0, path_1.join)(base, `behavior/${entry}.tsx`),
            (0, path_1.join)(base, `behavior/${entry}.js`),
            (0, path_1.join)(base, "behavior", entry, "index.ts"),
            (0, path_1.join)(base, "behavior", entry, "index.js"),
        ].find(fs_1.existsSync);
        (0, assert_1.ok)(entryPoint, `No entry point found for ${entry}`);
        const sourceFile = program.getSourceFile(entryPoint);
        (0, assert_1.ok)(sourceFile, `No source file found for ${entryPoint}`);
        return { displayName: entry, program, sourceFile, entryPoint };
    });
    app.options.setValue("entryPoints", entryPoints.map((e) => e.entryPoint));
    (0, comments_1.clearCommentCache)();
    return app.converter.convert(entryPoints);
}
describe("Behavior Tests", () => {
    let logger;
    let optionsSnap;
    beforeEach(() => {
        app.logger = logger = new TestLogger_1.TestLogger();
        optionsSnap = app.options.snapshot();
    });
    afterEach(() => {
        app.options.restore(optionsSnap);
        logger.expectNoOtherMessages();
    });
    it("Handles 'as const' style enums", () => {
        const project = convert("asConstEnum");
        const SomeEnumLike = (0, utils_2.query)(project, "SomeEnumLike");
        (0, assert_1.deepStrictEqual)(SomeEnumLike.kind, models_1.ReflectionKind.Variable, "SomeEnumLike");
        const SomeEnumLikeTagged = (0, utils_2.query)(project, "SomeEnumLikeTagged");
        (0, assert_1.deepStrictEqual)(SomeEnumLikeTagged.kind, models_1.ReflectionKind.Enum, "SomeEnumLikeTagged");
        const A = (0, utils_2.query)(project, "SomeEnumLikeTagged.a");
        (0, assert_1.deepStrictEqual)(A.type, new models_1.LiteralType("a"));
        (0, assert_1.deepStrictEqual)(A.defaultValue, undefined);
        const ManualEnum = (0, utils_2.query)(project, "ManualEnum");
        (0, assert_1.deepStrictEqual)(ManualEnum.kind, models_1.ReflectionKind.Enum, "ManualEnum");
        const ManualWithoutHelper = (0, utils_2.query)(project, "ManualEnumHelper");
        (0, assert_1.deepStrictEqual)(ManualWithoutHelper.kind, models_1.ReflectionKind.Enum, "ManualEnumHelper");
        const WithoutReadonly = (0, utils_2.query)(project, "WithoutReadonly");
        (0, assert_1.deepStrictEqual)(WithoutReadonly.kind, models_1.ReflectionKind.Enum, "WithoutReadonly");
        const SomeEnumLikeNumeric = (0, utils_2.query)(project, "SomeEnumLikeNumeric");
        (0, assert_1.deepStrictEqual)(SomeEnumLikeNumeric.kind, models_1.ReflectionKind.Variable, "SomeEnumLikeNumeric");
        const SomeEnumLikeTaggedNumeric = (0, utils_2.query)(project, "SomeEnumLikeTaggedNumeric");
        (0, assert_1.deepStrictEqual)(SomeEnumLikeTaggedNumeric.kind, models_1.ReflectionKind.Enum, "SomeEnumLikeTaggedNumeric");
        const B = (0, utils_2.query)(project, "SomeEnumLikeTaggedNumeric.b");
        (0, assert_1.deepStrictEqual)(B.type, new models_1.LiteralType(1));
        (0, assert_1.deepStrictEqual)(B.defaultValue, undefined);
        const ManualEnumNumeric = (0, utils_2.query)(project, "ManualEnumNumeric");
        (0, assert_1.deepStrictEqual)(ManualEnumNumeric.kind, models_1.ReflectionKind.Enum, "ManualEnumNumeric");
        const ManualWithoutHelperNumeric = (0, utils_2.query)(project, "ManualEnumHelperNumeric");
        (0, assert_1.deepStrictEqual)(ManualWithoutHelperNumeric.kind, models_1.ReflectionKind.Enum, "ManualEnumHelperNumeric");
        const WithoutReadonlyNumeric = (0, utils_2.query)(project, "WithoutReadonlyNumeric");
        (0, assert_1.deepStrictEqual)(WithoutReadonlyNumeric.kind, models_1.ReflectionKind.Enum, "WithoutReadonlyNumeric");
        const WithInvalidTypeUnionMember = (0, utils_2.query)(project, "WithInvalidTypeUnionMember");
        (0, assert_1.deepStrictEqual)(WithInvalidTypeUnionMember.kind, models_1.ReflectionKind.Variable, "WithInvalidTypeUnionMember");
        const WithNumericExpression = (0, utils_2.query)(project, "WithNumericExpression");
        (0, assert_1.deepStrictEqual)(WithNumericExpression.kind, models_1.ReflectionKind.Enum, "WithNumericExpression");
    });
    it("Handles non-jsdoc block comments", () => {
        app.options.setValue("commentStyle", declaration_1.CommentStyle.Block);
        const project = convert("blockComment");
        const a = (0, utils_2.query)(project, "a");
        const b = (0, utils_2.query)(project, "b");
        (0, assert_1.deepStrictEqual)(models_1.Comment.combineDisplayParts(a.comment?.summary), "jsdoc block");
        (0, assert_1.deepStrictEqual)(models_1.Comment.combineDisplayParts(b.comment?.summary), "block, but not jsdoc");
    });
    it("Handles const variable namespace", () => {
        const project = convert("constNamespace");
        const someNs = (0, utils_2.query)(project, "someNs");
        (0, assert_1.deepStrictEqual)(someNs.kind, models_1.ReflectionKind.Namespace);
        (0, assert_1.deepStrictEqual)(models_1.Comment.combineDisplayParts(someNs.comment?.summary), "ns doc");
        const a = (0, utils_2.query)(project, "someNs.a");
        (0, assert_1.deepStrictEqual)(models_1.Comment.combineDisplayParts(a.comment?.summary), "a doc");
        const b = (0, utils_2.query)(project, "someNs.b");
        (0, assert_1.deepStrictEqual)(models_1.Comment.combineDisplayParts(b.signatures?.[0].comment?.summary), "b doc");
    });
    it("Should allow the user to mark a variable or function as a class with @class", () => {
        const project = convert("classTag");
        logger.expectMessage(`warn: BadClass is being converted as a class, but does not have any construct signatures`);
        const CallableClass = (0, utils_2.query)(project, "CallableClass");
        (0, assert_1.deepStrictEqual)(CallableClass.signatures?.length, 2);
        (0, assert_1.deepStrictEqual)(CallableClass.signatures.map((sig) => sig.type?.toString()), ["number", "string"]);
        (0, assert_1.deepStrictEqual)(CallableClass.signatures.map((sig) => sig.flags.isStatic), [true, false]);
        (0, assert_1.deepStrictEqual)(CallableClass.children?.map((child) => [
            child.name,
            models_1.ReflectionKind.singularString(child.kind),
        ]), [
            [
                "constructor",
                models_1.ReflectionKind.singularString(models_1.ReflectionKind.Constructor),
            ],
            [
                "inst",
                models_1.ReflectionKind.singularString(models_1.ReflectionKind.Property),
            ],
            [
                "stat",
                models_1.ReflectionKind.singularString(models_1.ReflectionKind.Property),
            ],
            [
                "method",
                models_1.ReflectionKind.singularString(models_1.ReflectionKind.Method),
            ],
        ]);
        (0, assert_1.deepStrictEqual)((0, utils_2.query)(project, "CallableClass.stat").flags.isStatic, true);
        (0, assert_1.deepStrictEqual)(["VariableClass", "VariableClass.stat", "VariableClass.inst"].map((name) => (0, utils_2.getComment)(project, name)), ["Variable class", "Stat docs", "Inst docs"]);
        (0, assert_1.deepStrictEqual)(project.children?.map((c) => c.name), ["BadClass", "CallableClass", "VariableClass"]);
    });
    it("Handles const type parameters", () => {
        const project = convert("constTypeParam");
        const getNamesExactly = (0, utils_2.query)(project, "getNamesExactly");
        const typeParams = getNamesExactly.signatures?.[0].typeParameters;
        (0, assert_1.deepStrictEqual)(typeParams?.length, 1);
        (0, assert_1.deepStrictEqual)(typeParams[0].flags.isConst, true);
    });
    it("Handles declare global 'modules'", () => {
        const project = convert("declareGlobal");
        (0, assert_1.deepStrictEqual)(project.children?.map((c) => c.name), ["DeclareGlobal"]);
    });
    it("Handles duplicate heritage clauses", () => {
        const project = convert("duplicateHeritageClauses");
        const b = (0, utils_2.query)(project, "B");
        (0, assert_1.deepStrictEqual)(b.extendedTypes?.map(String), ["A"]);
        const c = (0, utils_2.query)(project, "C");
        (0, assert_1.deepStrictEqual)(c.extendedTypes?.map(String), ["A"]);
        (0, assert_1.deepStrictEqual)(c.implementedTypes?.map(String), ["A"]);
        const d = (0, utils_2.query)(project, "D");
        (0, assert_1.deepStrictEqual)(d.extendedTypes?.map(String), [
            'Record<"a", 1>',
            'Record<"b", 1>',
        ]);
    });
    it("Handles @default tags with JSDoc compat turned on", () => {
        const project = convert("defaultTag");
        const foo = (0, utils_2.query)(project, "foo");
        const tags = foo.comment?.blockTags.map((tag) => tag.content);
        (0, assert_1.deepStrictEqual)(tags, [
            [{ kind: "code", text: "```ts\n\n```" }],
            [{ kind: "code", text: "```ts\nfn({})\n```" }],
        ]);
        logger.expectNoOtherMessages();
    });
    it("Handles @default tags with JSDoc compat turned off", () => {
        app.options.setValue("jsDocCompatibility", false);
        const project = convert("defaultTag");
        const foo = (0, utils_2.query)(project, "foo");
        const tags = foo.comment?.blockTags.map((tag) => tag.content);
        (0, assert_1.deepStrictEqual)(tags, [[], [{ kind: "text", text: "fn({})" }]]);
        logger.expectMessage("warn: Encountered an unescaped open brace without an inline tag");
        logger.expectMessage("warn: Unmatched closing brace");
        logger.expectNoOtherMessages();
    });
    it("Handles @defaultValue tags", () => {
        const project = convert("defaultValueTag");
        const foo = (0, utils_2.query)(project, "foo");
        const tags = foo.comment?.blockTags.map((tag) => tag.content);
        (0, assert_1.deepStrictEqual)(tags, [
            [{ kind: "code", text: "```ts\n\n```" }],
            [{ kind: "code", text: "```ts\nfn({})\n```" }],
        ]);
        logger.expectNoOtherMessages();
    });
    it("Handles @example tags with JSDoc compat turned on", () => {
        const project = convert("exampleTags");
        const foo = (0, utils_2.query)(project, "foo");
        const tags = foo.comment?.blockTags.map((tag) => tag.content);
        const names = foo.comment?.blockTags.map((tag) => tag.name);
        (0, assert_1.deepStrictEqual)(tags, [
            [{ kind: "code", text: "```ts\n// JSDoc style\ncodeHere();\n```" }],
            [
                {
                    kind: "code",
                    text: "```ts\n// JSDoc style\ncodeHere();\n```",
                },
            ],
            [
                {
                    kind: "code",
                    text: "```ts\nx.map(() => { return 1; })\n```",
                },
            ],
            [{ kind: "code", text: "```ts\n// TSDoc style\ncodeHere();\n```" }],
            [{ kind: "code", text: "```ts\n// TSDoc style\ncodeHere();\n```" }],
            [{ kind: "code", text: "```ts\noops();\n```" }],
        ]);
        (0, assert_1.deepStrictEqual)(names, [
            undefined,
            "JSDoc specialness",
            "JSDoc with braces",
            undefined,
            "TSDoc name",
            "Bad {@link} name",
        ]);
        logger.expectMessage("warn: The first line of an example tag will be taken literally as the example name, and should only contain text");
        logger.expectNoOtherMessages();
    });
    it("Warns about example tags containing braces when compat options are off", () => {
        app.options.setValue("jsDocCompatibility", false);
        const project = convert("exampleTags");
        const foo = (0, utils_2.query)(project, "foo");
        const tags = foo.comment?.blockTags.map((tag) => tag.content);
        const names = foo.comment?.blockTags.map((tag) => tag.name);
        (0, assert_1.deepStrictEqual)(tags, [
            [{ kind: "text", text: "// JSDoc style\ncodeHere();" }],
            [
                {
                    kind: "text",
                    text: "// JSDoc style\ncodeHere();",
                },
            ],
            [
                {
                    kind: "text",
                    text: "x.map(() => { return 1; })",
                },
            ],
            [{ kind: "code", text: "```ts\n// TSDoc style\ncodeHere();\n```" }],
            [{ kind: "code", text: "```ts\n// TSDoc style\ncodeHere();\n```" }],
            [{ kind: "code", text: "```ts\noops();\n```" }],
        ]);
        (0, assert_1.deepStrictEqual)(names, [
            undefined,
            "<caption>JSDoc specialness</caption>",
            "<caption>JSDoc with braces</caption>",
            undefined,
            "TSDoc name",
            "Bad {@link} name",
        ]);
        logger.expectMessage("warn: Encountered an unescaped open brace without an inline tag");
        logger.expectMessage("warn: Unmatched closing brace");
        logger.expectMessage("warn: The first line of an example tag will be taken literally as the example name, and should only contain text");
        logger.expectNoOtherMessages();
    });
    it("Handles excludeCategories", () => {
        app.options.setValue("excludeCategories", ["A", "Default"]);
        app.options.setValue("defaultCategory", "Default");
        const project = convert("excludeCategories");
        (0, assert_1.deepStrictEqual)(project.children?.map((c) => c.name), ["c"]);
    });
    it("Handles excludeNotDocumentedKinds", () => {
        app.options.setValue("excludeNotDocumented", true);
        app.options.setValue("excludeNotDocumentedKinds", ["Property"]);
        const project = convert("excludeNotDocumentedKinds");
        (0, assert_1.deepStrictEqual)(buildNameTree(project), {
            NotDoc: {
                prop: {},
            },
            identity: {},
        });
    });
    it("Handles comments on export declarations", () => {
        const project = convert("exportComments");
        const abc = (0, utils_2.query)(project, "abc");
        (0, assert_1.deepStrictEqual)(abc.kind, models_1.ReflectionKind.Variable);
        (0, assert_1.deepStrictEqual)(models_1.Comment.combineDisplayParts(abc.comment?.summary), "abc");
        const abcRef = (0, utils_2.query)(project, "abcRef");
        (0, assert_1.deepStrictEqual)(abcRef.kind, models_1.ReflectionKind.Reference);
        (0, assert_1.deepStrictEqual)(models_1.Comment.combineDisplayParts(abcRef.comment?.summary), "export abc");
        const foo = (0, utils_2.query)(project, "foo");
        (0, assert_1.deepStrictEqual)(models_1.Comment.combineDisplayParts(foo.comment?.summary), "export foo");
    });
    it("Handles user defined external symbol links", () => {
        app.options.setValue("externalSymbolLinkMappings", {
            global: {
                Promise: "/promise",
            },
            typescript: {
                Promise: "/promise2",
            },
            "@types/markdown-it": {
                "MarkdownIt.Token": "https://markdown-it.github.io/markdown-it/#Token",
                "*": "https://markdown-it.github.io/markdown-it/",
            },
        });
        const project = convert("externalSymbols");
        const p = (0, utils_2.query)(project, "P");
        (0, assert_1.deepStrictEqual)(p.comment?.summary[1], {
            kind: "inline-tag",
            tag: "@link",
            target: "/promise",
            text: "!Promise",
        });
        (0, assert_1.deepStrictEqual)(p.type?.type, "reference");
        (0, assert_1.deepStrictEqual)(p.type.externalUrl, "/promise2");
        const m = (0, utils_2.query)(project, "T");
        (0, assert_1.deepStrictEqual)(m.type?.type, "reference");
        (0, assert_1.deepStrictEqual)(m.type.externalUrl, "https://markdown-it.github.io/markdown-it/#Token");
        const s = (0, utils_2.query)(project, "Pr");
        (0, assert_1.deepStrictEqual)(s.type?.type, "reference");
        (0, assert_1.deepStrictEqual)(s.type.externalUrl, "https://markdown-it.github.io/markdown-it/");
    });
    it("Handles @group tag", () => {
        const project = convert("groupTag");
        const A = (0, utils_2.query)(project, "A");
        const B = (0, utils_2.query)(project, "B");
        const C = (0, utils_2.query)(project, "C");
        const D = (0, utils_2.query)(project, "D");
        (0, assert_1.deepStrictEqual)(project.groups?.map((g) => g.title), ["Variables", "A", "B", "With Spaces"]);
        (0, assert_1.deepStrictEqual)(project.groups.map((g) => models_1.Comment.combineDisplayParts(g.description)), ["Variables desc", "A description", "", "With spaces desc"]);
        (0, assert_1.deepStrictEqual)(project.groups.map((g) => g.children), [[D], [A, B], [B], [C]]);
    });
    it("Inherits @group tag if comment is not redefined", () => {
        const project = convert("groupInheritance");
        const cls = (0, utils_2.query)(project, "Cls");
        (0, assert_1.deepStrictEqual)(cls.groups?.map((g) => g.title), ["Constructors", "Group"]);
        (0, assert_1.deepStrictEqual)(cls.groups.map((g) => g.children), [[(0, utils_2.query)(project, "Cls.constructor")], [(0, utils_2.query)(project, "Cls.prop")]]);
    });
    it("Inherits @category tag if comment is not redefined", () => {
        app.options.setValue("categorizeByGroup", false);
        const project = convert("categoryInheritance");
        const cls = (0, utils_2.query)(project, "Cls");
        (0, assert_1.deepStrictEqual)(cls.categories?.map((g) => g.title), ["Cat", "Other"]);
        (0, assert_1.deepStrictEqual)(cls.categories.map((g) => models_1.Comment.combineDisplayParts(g.description)), ["Cat desc", ""]);
        (0, assert_1.deepStrictEqual)(cls.categories.map((g) => g.children), [[(0, utils_2.query)(project, "Cls.prop")], [(0, utils_2.query)(project, "Cls.constructor")]]);
    });
    it("Handles hidden accessors", () => {
        const project = convert("hiddenAccessor");
        const test = (0, utils_2.query)(project, "Test");
        (0, assert_1.deepStrictEqual)(test.children?.map((c) => c.name), ["constructor", "auto", "x", "y"]);
    });
    it("Handles @hideconstructor", () => {
        const project = convert("hideconstructor");
        (0, assert_1.ok)(!project.getChildByName("StaticOnly.constructor"));
        (0, assert_1.ok)(!!project.getChildByName("StaticOnly.notHidden"));
        (0, assert_1.ok)(!project.getChildByName("IgnoredCtor.constructor"));
    });
    it("Handles simple @inheritDoc cases", () => {
        const project = convert("inheritDocBasic");
        const target = (0, utils_2.query)(project, "InterfaceTarget");
        const comment = new models_1.Comment([{ kind: "text", text: "Summary" }], [new models_1.CommentTag("@remarks", [{ kind: "text", text: "Remarks" }])]);
        (0, assert_1.deepStrictEqual)(target.comment, comment);
        (0, assert_1.deepStrictEqual)(models_1.Comment.combineDisplayParts(target.typeParameters?.[0].comment?.summary), "Type parameter");
        const prop = (0, utils_2.query)(project, "InterfaceTarget.property");
        (0, assert_1.deepStrictEqual)(models_1.Comment.combineDisplayParts(prop.comment?.summary), "Property description");
        const meth = (0, utils_2.query)(project, "InterfaceTarget.someMethod");
        const example = new models_1.CommentTag("@example", [
            { kind: "code", text: "```ts\nsomeMethod(123)\n```" },
        ]);
        example.name = `This should still be present`;
        const methodComment = new models_1.Comment([{ kind: "text", text: "Method description" }], [example]);
        (0, assert_1.deepStrictEqual)(meth.signatures?.[0].comment, methodComment);
    });
    it("Handles more complicated @inheritDoc cases", () => {
        const project = convert("inheritDocJsdoc");
        const fooComment = (0, utils_2.query)(project, "Foo").comment;
        const fooMemberComment = (0, utils_2.query)(project, "Foo.member").signatures?.[0]
            .comment;
        const xComment = (0, utils_2.query)(project, "Foo.member").signatures?.[0]
            .parameters?.[0].comment;
        (0, assert_1.ok)(fooComment, "Foo");
        (0, assert_1.ok)(fooMemberComment, "Foo.member");
        (0, assert_1.ok)(xComment, "Foo.member.x");
        for (const name of ["Bar", "Baz"]) {
            (0, assert_1.deepStrictEqual)((0, utils_2.query)(project, name).comment, fooComment, name);
        }
        for (const name of ["Bar.member", "Baz.member"]) {
            const refl = (0, utils_2.query)(project, name);
            (0, assert_1.deepStrictEqual)(refl.signatures?.length, 1, name);
            (0, assert_1.deepStrictEqual)(refl.signatures[0].comment, fooMemberComment, `${name} signature`);
            (0, assert_1.deepStrictEqual)(refl.signatures[0].parameters?.[0].comment, xComment, `${name} parameter`);
        }
    });
    it("Handles recursive @inheritDoc requests", () => {
        const project = convert("inheritDocRecursive");
        const a = (0, utils_2.query)(project, "A");
        (0, assert_1.deepStrictEqual)(a.comment?.getTag("@inheritDoc")?.name, "B");
        const b = (0, utils_2.query)(project, "B");
        (0, assert_1.deepStrictEqual)(b.comment?.getTag("@inheritDoc")?.name, "C");
        const c = (0, utils_2.query)(project, "C");
        (0, assert_1.deepStrictEqual)(c.comment?.getTag("@inheritDoc")?.name, "A");
        logger.expectMessage("warn: @inheritDoc specifies a circular inheritance chain: B -> C -> A -> B");
    });
    it("Handles @inheritDoc on signatures", () => {
        const project = convert("inheritDocSignature");
        const test1 = (0, utils_2.query)(project, "SigRef.test1");
        (0, assert_1.deepStrictEqual)(test1.signatures?.length, 2);
        (0, assert_1.deepStrictEqual)(models_1.Comment.combineDisplayParts(test1.signatures[0].comment?.summary), "A");
        (0, assert_1.deepStrictEqual)(models_1.Comment.combineDisplayParts(test1.signatures[1].comment?.summary), "B");
        const test2 = (0, utils_2.query)(project, "SigRef.test2");
        (0, assert_1.deepStrictEqual)(models_1.Comment.combineDisplayParts(test2.signatures?.[0].comment?.summary), "C");
    });
    it("Handles @inheritDocs which produce warnings", () => {
        const project = convert("inheritDocWarnings");
        const target1 = (0, utils_2.query)(project, "target1");
        (0, assert_1.deepStrictEqual)(models_1.Comment.combineDisplayParts(target1.comment?.summary), "Source");
        (0, assert_1.deepStrictEqual)(models_1.Comment.combineDisplayParts(target1.comment?.getTag("@remarks")?.content), "Remarks");
        logger.expectMessage("warn: Content in the summary section will be overwritten by the @inheritDoc tag in comment at ./src/test/converter2/behavior/inheritDocWarnings.ts:10");
        const target2 = (0, utils_2.query)(project, "target2");
        (0, assert_1.deepStrictEqual)(models_1.Comment.combineDisplayParts(target2.comment?.summary), "Source");
        (0, assert_1.deepStrictEqual)(models_1.Comment.combineDisplayParts(target2.comment?.getTag("@remarks")?.content), "Remarks");
        logger.expectMessage("warn: Content in the @remarks block will be overwritten by the @inheritDoc tag in comment at ./src/test/converter2/behavior/inheritDocWarnings.ts:16");
        const target3 = (0, utils_2.query)(project, "target3");
        (0, assert_1.ok)(target3.comment?.getTag("@inheritDoc"));
        logger.expectMessage('warn: Failed to find "doesNotExist" to inherit the comment from in the comment for target3');
        const target4 = (0, utils_2.query)(project, "target4");
        (0, assert_1.ok)(target4.comment?.getTag("@inheritDoc"));
        logger.expectMessage("warn: target4 tried to copy a comment from source2 with @inheritDoc, but the source has no associated comment");
        logger.expectMessage("warn: Declaration reference in @inheritDoc for badParse was not fully parsed and may resolve incorrectly");
        logger.expectNoOtherMessages();
    });
    it("Handles line comments", () => {
        app.options.setValue("commentStyle", declaration_1.CommentStyle.Line);
        const project = convert("lineComment");
        const a = (0, utils_2.query)(project, "a");
        const b = (0, utils_2.query)(project, "b");
        const c = (0, utils_2.query)(project, "c");
        (0, assert_1.deepStrictEqual)(models_1.Comment.combineDisplayParts(a.comment?.summary), "docs");
        (0, assert_1.deepStrictEqual)(models_1.Comment.combineDisplayParts(b.comment?.summary), "docs\nwith multiple lines");
        (0, assert_1.deepStrictEqual)(models_1.Comment.combineDisplayParts(c.comment?.summary), "");
    });
    it("Handles declaration reference link resolution", () => {
        app.options.setValue("sort", ["source-order"]);
        app.options.setValue("useTsLinkResolution", false);
        const project = convert("linkResolution");
        for (const [refl, target] of [
            ["Scoping.abc", "Scoping.abc"],
            ["Scoping.Foo", "Scoping.Foo.abc"],
            ["Scoping.Foo.abc", "Scoping.Foo.abc"],
            ["Scoping.Bar", "Scoping.abc"],
            ["Scoping.Bar.abc", "Scoping.abc"],
        ]) {
            (0, assert_1.deepStrictEqual)(getLinks((0, utils_2.query)(project, refl)).map((x) => x[1]), [(0, utils_2.query)(project, target).getFullName()]);
        }
        const links = getLinks((0, utils_2.query)(project, "Meanings"));
        (0, assert_1.deepStrictEqual)(links, [
            [models_1.ReflectionKind.Enum, "Meanings.A"],
            [models_1.ReflectionKind.Namespace, "Meanings.A"],
            [models_1.ReflectionKind.Enum, "Meanings.A"],
            [undefined],
            [models_1.ReflectionKind.Class, "Meanings.B"],
            [models_1.ReflectionKind.Interface, "Meanings.C"],
            [models_1.ReflectionKind.TypeAlias, "Meanings.D"],
            ["Meanings.E.E", 0],
            [models_1.ReflectionKind.Variable, "Meanings.F"],
            ["Meanings.B.constructor.new B", 0],
            ["Meanings.B.constructor.new B", 0],
            ["Meanings.B.constructor.new B", 1],
            [models_1.ReflectionKind.EnumMember, "Meanings.A.A"],
            [undefined],
            ["Meanings.E.E", 0],
            ["Meanings.E.E", 1],
            ["Meanings.B.constructor.new B", 0],
            ["Meanings.B.constructor.new B", 1],
            ["Meanings.B.__index", undefined],
            [models_1.ReflectionKind.Interface, "Meanings.G"],
            ["Meanings.E.E", 1],
            [models_1.ReflectionKind.Class, "Meanings.B"],
        ]);
        (0, assert_1.deepStrictEqual)(getLinks((0, utils_2.query)(project, "URLS")), [
            "https://example.com",
            "ftp://example.com",
        ]);
        (0, assert_1.deepStrictEqual)(getLinks((0, utils_2.query)(project, "Globals.A")).map((x) => x[1]), ["URLS", "A", "Globals.A"]);
        (0, assert_1.deepStrictEqual)(getLinks((0, utils_2.query)(project, "Navigation")), [
            [models_1.ReflectionKind.Method, "Navigation.Child.foo"],
            [models_1.ReflectionKind.Property, "Navigation.Child.foo"],
            [undefined],
        ]);
        const foo = (0, utils_2.query)(project, "Navigation.Child.foo").signatures[0];
        (0, assert_1.deepStrictEqual)(getLinks(foo), [[models_1.ReflectionKind.Method, "Navigation.Child.foo"]]);
    });
    it("Handles TypeScript based link resolution", () => {
        app.options.setValue("sort", ["source-order"]);
        const project = convert("linkResolutionTs");
        for (const [refl, target] of [
            ["Scoping.abc", "Scoping.abc"],
            ["Scoping.Foo", "Scoping.Foo.abc"],
            ["Scoping.Foo.abc", "Scoping.Foo.abc"],
            ["Scoping.Bar", "Scoping.abc"],
            ["Scoping.Bar.abc", "Scoping.abc"],
        ]) {
            (0, assert_1.deepStrictEqual)(getLinks((0, utils_2.query)(project, refl)).map((x) => x[1]), [(0, utils_2.query)(project, target).getFullName()]);
        }
        const links = getLinks((0, utils_2.query)(project, "Meanings"));
        (0, assert_1.deepStrictEqual)(links, [
            [models_1.ReflectionKind.Namespace, "Meanings"],
            [models_1.ReflectionKind.Namespace, "Meanings"],
            [models_1.ReflectionKind.Namespace, "Meanings"],
            [models_1.ReflectionKind.Enum, "Meanings.A"],
            [models_1.ReflectionKind.Class, "Meanings.B"],
            [models_1.ReflectionKind.Interface, "Meanings.C"],
            [models_1.ReflectionKind.TypeAlias, "Meanings.D"],
            [models_1.ReflectionKind.Function, "Meanings.E"],
            [models_1.ReflectionKind.Variable, "Meanings.F"],
            [models_1.ReflectionKind.Class, "Meanings.B"],
            [models_1.ReflectionKind.Class, "Meanings.B"],
            [models_1.ReflectionKind.Class, "Meanings.B"],
            [models_1.ReflectionKind.EnumMember, "Meanings.A.A"],
            [models_1.ReflectionKind.Property, "Meanings.B.prop"],
            [models_1.ReflectionKind.Function, "Meanings.E"],
            [models_1.ReflectionKind.Function, "Meanings.E"],
            [models_1.ReflectionKind.Class, "Meanings.B"],
            [models_1.ReflectionKind.Class, "Meanings.B"],
            [models_1.ReflectionKind.Class, "Meanings.B"],
            [models_1.ReflectionKind.Interface, "Meanings.G"],
            [models_1.ReflectionKind.Function, "Meanings.E"],
            [models_1.ReflectionKind.Class, "Meanings.B"],
        ]);
        (0, assert_1.deepStrictEqual)(getLinks((0, utils_2.query)(project, "URLS")), [
            "https://example.com",
            "ftp://example.com",
        ]);
        (0, assert_1.deepStrictEqual)(getLinks((0, utils_2.query)(project, "Globals.A")).map((x) => x[1]), ["URLS", "A", "Globals.A"]);
        (0, assert_1.deepStrictEqual)(getLinks((0, utils_2.query)(project, "Navigation")), [
            [models_1.ReflectionKind.Namespace, "Navigation"],
            [models_1.ReflectionKind.Property, "Navigation.Child.foo"],
            [models_1.ReflectionKind.Class, "Navigation.Child"],
        ]);
        const foo = (0, utils_2.query)(project, "Navigation.Child.foo").signatures[0];
        (0, assert_1.deepStrictEqual)(getLinks(foo), [[models_1.ReflectionKind.Method, "Navigation.Child.foo"]]);
        const localSymbolRef = (0, utils_2.query)(project, "localSymbolRef");
        (0, assert_1.deepStrictEqual)(getLinks(localSymbolRef), [
            [models_1.ReflectionKind.Variable, "A"],
            [models_1.ReflectionKind.Variable, "A"],
            [models_1.ReflectionKind.Variable, "A"],
        ]);
        (0, assert_1.deepStrictEqual)(getLinkTexts(localSymbolRef), ["A!", "A2!", "AnotherName"]);
        (0, assert_1.deepStrictEqual)(getLinks((0, utils_2.query)(project, "scoped")), [
            [models_1.ReflectionKind.Property, "Meanings.B.prop"],
        ]);
        (0, assert_1.deepStrictEqual)(getLinkTexts((0, utils_2.query)(project, "scoped")), ["p"]);
    });
    it("Handles merged declarations", () => {
        const project = convert("mergedDeclarations");
        const a = (0, utils_2.query)(project, "SingleCommentMultiDeclaration");
        (0, assert_1.deepStrictEqual)(models_1.Comment.combineDisplayParts(a.comment?.summary), "Comment on second declaration");
        const b = (0, utils_2.query)(project, "MultiCommentMultiDeclaration");
        (0, assert_1.deepStrictEqual)(models_1.Comment.combineDisplayParts(b.comment?.summary), "Comment 1");
        logger.expectMessage("warn: MultiCommentMultiDeclaration has multiple declarations with a comment. An arbitrary comment will be used");
        logger.expectMessage("info: The comments for MultiCommentMultiDeclaration are declared at*");
    });
    it("Handles named tuple declarations", () => {
        const project = convert("namedTupleMembers");
        (0, assert_1.deepStrictEqual)((0, utils_2.query)(project, "PartiallyNamedTuple").type?.toString(), "[name: string, number]");
        (0, assert_1.deepStrictEqual)((0, utils_2.query)(project, "PartiallyNamedTuple2").type?.toString(), "[name?: string, number?]");
        (0, assert_1.deepStrictEqual)((0, utils_2.query)(project, "PartiallyNamedTupleRest").type?.toString(), "[name?: string, ...number[]]");
        (0, assert_1.deepStrictEqual)((0, utils_2.query)(project, "partiallyNamedTupleRest").type?.toString(), "[name?: string, ...number[]]");
    });
    it("Handles overloads", () => {
        const project = convert("overloads");
        const foo = (0, utils_2.query)(project, "foo");
        const fooComments = foo.signatures?.map((sig) => models_1.Comment.combineDisplayParts(sig.comment?.summary));
        (0, assert_1.deepStrictEqual)(fooComments, ["No arg comment\n", "No arg comment\n"]);
        (0, assert_1.deepStrictEqual)(foo.comment, undefined);
        (0, assert_1.deepStrictEqual)(foo.signatures?.map((s) => s.comment?.label), ["NO_ARGS", "WITH_X"]);
        const bar = (0, utils_2.query)(project, "bar");
        const barComments = bar.signatures?.map((sig) => models_1.Comment.combineDisplayParts(sig.comment?.summary));
        (0, assert_1.deepStrictEqual)(barComments, ["", "Custom comment"]);
        (0, assert_1.deepStrictEqual)(models_1.Comment.combineDisplayParts(bar.comment?.summary), "Implementation comment");
        logger.expectMessage('warn: The label "bad" for badLabel cannot be referenced with a declaration reference. Labels may only contain A-Z, 0-9, and _, and may not start with a number');
        logger.expectNoOtherMessages();
    });
    it("Handles @overload tags", () => {
        const project = convert("overloadTags");
        const printValue = (0, utils_2.query)(project, "printValue");
        (0, assert_1.deepStrictEqual)(printValue.signatures?.length, 2);
        const [first, second] = printValue.signatures;
        (0, assert_1.deepStrictEqual)(first.parameters?.length, 1);
        (0, assert_1.deepStrictEqual)(models_1.Comment.combineDisplayParts(first.parameters[0].comment?.summary), "first docs");
        (0, assert_1.deepStrictEqual)(second.parameters?.length, 2);
        (0, assert_1.deepStrictEqual)(models_1.Comment.combineDisplayParts(second.parameters[0].comment?.summary), "second docs");
    });
    it("Handles @readonly tag", () => {
        const project = convert("readonlyTag");
        const title = (0, utils_2.query)(project, "Book.title");
        const author = (0, utils_2.query)(project, "Book.author");
        (0, assert_1.ok)(!title.setSignature);
        (0, assert_1.ok)(author.flags.isReadonly);
    });
    it("Removes all children of a reflection when the reflection is removed.", () => {
        const project = convert("removeReflection");
        project.removeReflection((0, utils_2.query)(project, "foo"));
        project.removeReflection((0, utils_2.query)(project, "nested"));
        (0, assert_1.deepStrictEqual)(Object.values(project.reflections).map((r) => r.name), ["typedoc"]);
    });
    it("Handles searchCategoryBoosts", () => {
        app.options.setValue("searchCategoryBoosts", {
            Cat0: 0,
            Cat1: 2.0,
            Cat2: 1.5,
            CatUnused: 999,
        });
        const project = convert("searchCategoryBoosts");
        const a = (0, utils_2.query)(project, "A");
        const b = (0, utils_2.query)(project, "B");
        const c = (0, utils_2.query)(project, "C");
        (0, assert_1.deepStrictEqual)(a.relevanceBoost, 3.0);
        (0, assert_1.deepStrictEqual)(b.relevanceBoost, 0.0);
        (0, assert_1.deepStrictEqual)(c.relevanceBoost, 2.0);
        logger.expectMessage("warn: Not all categories specified in searchCategoryBoosts were used in the documentation." +
            " The unused categories were:\n\tCatUnused");
        logger.expectNoOtherMessages();
    });
    it("Handles searchGroupBoosts", () => {
        app.options.setValue("searchGroupBoosts", {
            Group0: 0,
            Group1: 2.0,
            Group2: 1.5,
            GroupUnused: 999,
            Interfaces: 0.5,
        });
        const project = convert("searchGroupBoosts");
        const a = (0, utils_2.query)(project, "A");
        const b = (0, utils_2.query)(project, "B");
        const c = (0, utils_2.query)(project, "C");
        const d = (0, utils_2.query)(project, "D");
        (0, assert_1.deepStrictEqual)(a.relevanceBoost, 3.0);
        (0, assert_1.deepStrictEqual)(b.relevanceBoost, 0.0);
        (0, assert_1.deepStrictEqual)(c.relevanceBoost, 2.0);
        (0, assert_1.deepStrictEqual)(d.relevanceBoost, 0.5);
        logger.expectMessage("warn: Not all groups specified in searchGroupBoosts were used in the documentation." +
            " The unused groups were:\n\tGroupUnused");
        logger.expectNoOtherMessages();
    });
    it("Handles @see tags", () => {
        const project = convert("seeTags");
        const foo = (0, utils_2.query)(project, "foo");
        (0, assert_1.deepStrictEqual)(models_1.Comment.combineDisplayParts(foo.comment?.getTag("@see")?.content), " - Double tag\n - Second tag\n");
        const bar = (0, utils_2.query)(project, "bar");
        (0, assert_1.deepStrictEqual)(models_1.Comment.combineDisplayParts(bar.comment?.getTag("@see")?.content), "Single tag");
    });
    it("Handles type aliases marked with @interface", () => {
        const project = convert("typeAliasInterface");
        const bar = (0, utils_2.query)(project, "Bar");
        (0, assert_1.deepStrictEqual)(bar.kind, models_1.ReflectionKind.Interface);
        (0, assert_1.deepStrictEqual)(bar.children?.map((c) => c.name), ["a", "b"]);
        const comments = [bar, bar.children[0], bar.children[1]].map((r) => models_1.Comment.combineDisplayParts(r.comment?.summary));
        (0, assert_1.deepStrictEqual)(comments, ["Bar docs", "Bar.a docs", "Foo.b docs"]);
    });
    it("Allows specifying group sort order #2251", () => {
        app.options.setValue("groupOrder", ["B", "Variables", "A"]);
        const project = convert("groupTag");
        (0, assert_1.deepStrictEqual)(project.groups?.map((g) => g.title), ["B", "Variables", "A", "With Spaces"]);
    });
    it("Supports disabling sorting of entry points #2393", () => {
        app.options.setValue("sort", ["alphabetical"]);
        const project = convert("blockComment", "asConstEnum");
        (0, assert_1.deepStrictEqual)(project.children?.map((c) => c.name), ["asConstEnum", "blockComment"]);
        app.options.setValue("sortEntryPoints", false);
        const project2 = convert("blockComment", "asConstEnum");
        (0, assert_1.deepStrictEqual)(project2.children?.map((c) => c.name), ["blockComment", "asConstEnum"]);
    });
    it("Respects resolution-mode when resolving types", () => {
        app.options.setValue("excludeExternals", false);
        const MergedType = (0, utils_2.query)(convert("resolutionMode"), "MergedType");
        (0, assert_1.deepStrictEqual)(MergedType.children?.map((child) => child.name), ["cjs", "esm"]);
    });
    it("Special cases some `this` type occurrences", () => {
        const project = convert("thisType");
        (0, assert_1.deepStrictEqual)((0, utils_2.query)(project, "ThisClass.prop").type?.toString(), "ThisClass"); // Not special cased
        (0, assert_1.deepStrictEqual)((0, utils_2.querySig)(project, "ThisClass.returnThisImplicit").type?.toString(), "ThisClass"); // Not special cased
        (0, assert_1.deepStrictEqual)((0, utils_2.querySig)(project, "ThisClass.returnThis").type?.toString(), "this");
        (0, assert_1.deepStrictEqual)((0, utils_2.querySig)(project, "ThisClass.paramThis").parameters?.[0].type?.toString(), "this");
    });
    it("Handles renaming of destructured parameters via @param tag name inference", () => {
        const project = convert("destructuredParamRenames");
        const params = (name) => (0, utils_2.querySig)(project, name).parameters?.map((p) => p.name);
        (0, assert_1.deepStrictEqual)(params("functionWithADestructuredParameter"), [
            "destructuredParam",
        ]);
        (0, assert_1.deepStrictEqual)(params("functionWithADestructuredParameterAndExtraParameters"), [
            "__namedParameters",
            "extraParameter",
        ]);
        (0, assert_1.deepStrictEqual)(params("functionWithADestructuredParameterAndAnExtraParamDirective"), ["__namedParameters"]);
        const logs = [
            'warn: The signature functionWithADestructuredParameterAndExtraParameters has an @param with name "destructuredParam", which was not used',
            'warn: The signature functionWithADestructuredParameterAndExtraParameters has an @param with name "destructuredParam.paramZ", which was not used',
            'warn: The signature functionWithADestructuredParameterAndExtraParameters has an @param with name "destructuredParam.paramG", which was not used',
            'warn: The signature functionWithADestructuredParameterAndExtraParameters has an @param with name "destructuredParam.paramA", which was not used',
            'warn: The signature functionWithADestructuredParameterAndAnExtraParamDirective has an @param with name "fakeParameter", which was not used',
            'warn: The signature functionWithADestructuredParameterAndAnExtraParamDirective has an @param with name "destructuredParam", which was not used',
            'warn: The signature functionWithADestructuredParameterAndAnExtraParamDirective has an @param with name "destructuredParam.paramZ", which was not used',
            'warn: The signature functionWithADestructuredParameterAndAnExtraParamDirective has an @param with name "destructuredParam.paramG", which was not used',
            'warn: The signature functionWithADestructuredParameterAndAnExtraParamDirective has an @param with name "destructuredParam.paramA", which was not used',
        ];
        for (const log of logs) {
            logger.expectMessage(log);
        }
        logger.expectNoOtherMessages();
    });
    it("Should not warn about recursive types", () => {
        const project = convert("refusingToRecurse");
        const schemaTypeBased = (0, utils_2.query)(project, "schemaTypeBased");
        (0, assert_1.deepStrictEqual)(schemaTypeBased.type?.toString(), "Object & Object");
        (0, assert_1.deepStrictEqual)((0, utils_2.querySig)(project, "Map.getFilter").type?.toString(), "void | ExpressionSpecification");
        logger.expectNoMessage("debug: Refusing to recurse*");
    });
    it("Handles NoInfer intrinsic type", () => {
        const project = convert("noInfer");
        const sig = (0, utils_2.querySig)(project, "createStreetLight");
        (0, assert_1.deepStrictEqual)(sig.parameters?.length, 2);
        (0, assert_1.deepStrictEqual)(sig.parameters[0].type?.toString(), "C[]");
        (0, assert_1.deepStrictEqual)(sig.parameters[1].type?.toString(), "NoInfer<C>");
    });
    it("Handles inferred predicate functions from TS 5.5", () => {
        const project = convert("inferredPredicates");
        const sig = (0, utils_2.querySig)(project, "isNumber");
        (0, assert_1.deepStrictEqual)(sig.type?.toString(), "x is number");
        const sig2 = (0, utils_2.querySig)(project, "isNonNullish");
        (0, assert_1.deepStrictEqual)(sig2.type?.toString(), "x is NonNullable<T>");
    });
    it("Cascades specified modifier tags to child reflections, #2056", () => {
        const project = convert("cascadedModifiers");
        const mods = (s) => (0, utils_2.query)(project, s).comment?.modifierTags;
        const sigMods = (s) => (0, utils_2.querySig)(project, s).comment?.modifierTags;
        (0, assert_1.deepStrictEqual)(mods("BetaStuff"), new Set(["@beta"]));
        (0, assert_1.deepStrictEqual)(mods("BetaStuff.AlsoBeta"), new Set(["@beta"]));
        (0, assert_1.deepStrictEqual)(mods("BetaStuff.AlsoBeta.betaFish"), new Set());
        (0, assert_1.deepStrictEqual)(mods("BetaStuff.AlsoBeta.alphaFish"), new Set());
        (0, assert_1.deepStrictEqual)(sigMods("BetaStuff.AlsoBeta.betaFish"), new Set(["@beta"]));
        (0, assert_1.deepStrictEqual)(sigMods("BetaStuff.AlsoBeta.alphaFish"), new Set(["@alpha"]));
        logger.expectMessage("warn: The modifier tag @alpha is mutually exclusive with @beta in the comment for mutuallyExclusive");
    });
});
