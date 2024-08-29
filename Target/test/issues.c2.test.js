"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = require("assert");
const fs_1 = require("fs");
const path_1 = require("path");
const __1 = require("..");
const comments_1 = require("../lib/converter/comments");
const models_1 = require("../lib/models");
const programs_1 = require("./programs");
const TestLogger_1 = require("./TestLogger");
const utils_1 = require("./utils");
const base = (0, programs_1.getConverter2Base)();
const app = (0, programs_1.getConverter2App)();
const program = (0, programs_1.getConverter2Program)();
function doConvert(entry) {
    const entryPoint = [
        (0, path_1.join)(base, `issues/${entry}.ts`),
        (0, path_1.join)(base, `issues/${entry}.d.ts`),
        (0, path_1.join)(base, `issues/${entry}.tsx`),
        (0, path_1.join)(base, `issues/${entry}.js`),
        (0, path_1.join)(base, "issues", entry, "index.ts"),
        (0, path_1.join)(base, "issues", entry, "index.js"),
    ].find(fs_1.existsSync);
    (0, assert_1.ok)(entryPoint, `No entry point found for ${entry}`);
    const sourceFile = program.getSourceFile(entryPoint);
    (0, assert_1.ok)(sourceFile, `No source file found for ${entryPoint}`);
    app.options.setValue("entryPoints", [entryPoint]);
    (0, comments_1.clearCommentCache)();
    return app.converter.convert([
        {
            displayName: entry,
            program,
            sourceFile,
        },
    ]);
}
describe("Issue Tests", () => {
    let logger;
    let convert;
    let optionsSnap;
    beforeEach(function () {
        app.logger = logger = new TestLogger_1.TestLogger();
        optionsSnap = app.options.snapshot();
        const issueNumber = this.currentTest?.title.match(/#(\d+)/)?.[1];
        (0, assert_1.ok)(issueNumber, "Test name must contain an issue number.");
        convert = (name = `gh${issueNumber}`) => doConvert(name);
    });
    afterEach(() => {
        app.options.restore(optionsSnap);
        logger.expectNoOtherMessages();
    });
    it("#567", () => {
        const project = convert();
        const foo = (0, utils_1.query)(project, "foo");
        const sig = foo.signatures?.[0];
        (0, assert_1.ok)(sig, "Missing signature");
        (0, assert_1.ok)(sig.comment, "No comment for signature");
        const param = sig.parameters?.[0];
        (0, assert_1.deepStrictEqual)(param?.name, "x");
        (0, assert_1.deepStrictEqual)(models_1.Comment.combineDisplayParts(param.comment?.summary), "JSDoc style param name");
    });
    it("#671", () => {
        const project = convert();
        const toNumber = (0, utils_1.query)(project, "toNumber");
        const sig = toNumber.signatures?.[0];
        (0, assert_1.ok)(sig, "Missing signatures");
        const paramComments = sig.parameters?.map((param) => models_1.Comment.combineDisplayParts(param.comment?.summary));
        (0, assert_1.deepStrictEqual)(paramComments, [
            "the string to parse as a number",
            "whether to parse as an integer or float",
        ]);
    });
    it("#869", () => {
        const project = convert();
        const classFoo = project.children?.find((r) => r.name === "Foo" && r.kind === models_1.ReflectionKind.Class);
        (0, assert_1.ok)(classFoo instanceof models_1.DeclarationReflection);
        (0, assert_1.deepStrictEqual)(classFoo.children?.find((r) => r.name === "x"), undefined);
        const nsFoo = project.children?.find((r) => r.name === "Foo" && r.kind === models_1.ReflectionKind.Namespace);
        (0, assert_1.ok)(nsFoo instanceof models_1.DeclarationReflection);
        (0, assert_1.ok)(nsFoo.children?.find((r) => r.name === "x"));
    });
    it("#941 Supports computed names ", () => {
        const project = convert();
        const obj = (0, utils_1.query)(project, "Obj");
        (0, assert_1.deepStrictEqual)(obj.type?.visit({
            reflection(r) {
                return r.declaration.children?.map((c) => c.name);
            },
        }), ["[propertyName2]", "p1"]);
    });
    it("#1124", () => {
        const project = convert();
        (0, assert_1.deepStrictEqual)(project.children?.length, 1, "Namespace with type and value converted twice");
    });
    it("#1150", () => {
        const project = convert();
        const refl = (0, utils_1.query)(project, "IntersectFirst");
        (0, assert_1.deepStrictEqual)(refl.kind, models_1.ReflectionKind.TypeAlias);
        (0, assert_1.deepStrictEqual)(refl.type?.type, "indexedAccess");
    });
    it("#1164", () => {
        const project = convert();
        const refl = (0, utils_1.query)(project, "gh1164");
        (0, assert_1.deepStrictEqual)(models_1.Comment.combineDisplayParts(refl.signatures?.[0]?.parameters?.[0]?.comment?.summary), "{@link CommentedClass} Test description.");
        const tag = refl.signatures?.[0]?.comment?.blockTags.find((x) => x.tag === "@returns");
        (0, assert_1.ok)(tag);
        (0, assert_1.deepStrictEqual)(models_1.Comment.combineDisplayParts(tag.content), "Test description.");
    });
    it("#1215", () => {
        const project = convert();
        const foo = (0, utils_1.query)(project, "Foo.bar");
        (0, assert_1.ok)(foo.setSignature instanceof models_1.SignatureReflection);
        (0, assert_1.deepStrictEqual)(foo.setSignature.type?.toString(), "void");
    });
    it("#1255", () => {
        const project = convert();
        const foo = (0, utils_1.query)(project, "C.foo");
        (0, assert_1.deepStrictEqual)(models_1.Comment.combineDisplayParts(foo.comment?.summary), "Docs!");
    });
    it("#1261", () => {
        const project = convert();
        const prop = (0, utils_1.query)(project, "X.prop");
        (0, assert_1.deepStrictEqual)(models_1.Comment.combineDisplayParts(prop.comment?.summary), "The property of X.");
    });
    it("#1330", () => {
        const project = convert();
        const example = (0, utils_1.query)(project, "ExampleParam");
        (0, assert_1.deepStrictEqual)(example.type?.type, "reference");
        (0, assert_1.deepStrictEqual)(example.type.toString(), "Example");
    });
    it("#1366", () => {
        const project = convert();
        const foo = (0, utils_1.query)(project, "GH1366.Foo");
        (0, assert_1.deepStrictEqual)(foo.kind, models_1.ReflectionKind.Reference);
    });
    it("#1408", () => {
        const project = convert();
        const foo = (0, utils_1.querySig)(project, "foo");
        const type = foo.typeParameters?.[0].type;
        (0, assert_1.deepStrictEqual)(type?.toString(), "unknown[]");
    });
    it("#1436", () => {
        const project = convert();
        (0, assert_1.deepStrictEqual)(project.children?.map((c) => c.name), ["gh1436"]);
    });
    it("#1449", () => {
        const project = convert();
        const refl = (0, utils_1.query)(project, "gh1449").signatures?.[0];
        (0, assert_1.deepStrictEqual)(refl?.typeParameters?.[0].type?.toString(), "[foo: any, bar?: any]");
    });
    it("#1454", () => {
        const project = convert();
        const foo = (0, utils_1.querySig)(project, "foo");
        (0, assert_1.deepStrictEqual)(foo.type?.type, "reference");
        (0, assert_1.deepStrictEqual)(foo.type.toString(), "Foo");
        const bar = (0, utils_1.querySig)(project, "bar");
        (0, assert_1.deepStrictEqual)(bar.type?.type, "reference");
        (0, assert_1.deepStrictEqual)(bar.type.toString(), "Bar");
    });
    it("#1462", () => {
        const project = convert();
        const prop = (0, utils_1.query)(project, "PROP");
        (0, assert_1.deepStrictEqual)(prop.type?.toString(), "number");
        // Would be nice to get this to work someday
        (0, assert_1.deepStrictEqual)(prop.comment?.summary, void 0);
        const method = (0, utils_1.query)(project, "METHOD");
        (0, assert_1.deepStrictEqual)(models_1.Comment.combineDisplayParts(method.signatures?.[0].comment?.summary), "method docs");
    });
    it("#1481", () => {
        const project = convert();
        const signature = (0, utils_1.query)(project, "GH1481.static").signatures?.[0];
        (0, assert_1.deepStrictEqual)(models_1.Comment.combineDisplayParts(signature?.comment?.summary), "static docs");
        (0, assert_1.deepStrictEqual)(signature?.type?.toString(), "void");
    });
    it("#1483", () => {
        const project = convert();
        (0, assert_1.deepStrictEqual)((0, utils_1.query)(project, "gh1483.namespaceExport").kind, models_1.ReflectionKind.Method);
        (0, assert_1.deepStrictEqual)((0, utils_1.query)(project, "gh1483_2.staticMethod").kind, models_1.ReflectionKind.Method);
    });
    it("#1490", () => {
        const project = convert();
        const refl = (0, utils_1.query)(project, "GH1490.optionalMethod");
        (0, assert_1.deepStrictEqual)(models_1.Comment.combineDisplayParts(refl.signatures?.[0]?.comment?.summary), "With comment");
    });
    it("#1509", () => {
        const project = convert();
        const pFoo = (0, utils_1.query)(project, "PartialFoo.foo");
        (0, assert_1.deepStrictEqual)(pFoo.flags.isOptional, true);
        const rFoo = (0, utils_1.query)(project, "ReadonlyFoo.foo");
        (0, assert_1.deepStrictEqual)(rFoo.flags.isReadonly, true);
        (0, assert_1.deepStrictEqual)(rFoo.flags.isOptional, true);
    });
    it("#1514", () => {
        const project = convert();
        // Not ideal. Really we want to handle these names nicer...
        (0, utils_1.query)(project, "ComputedUniqueName.[UNIQUE_SYMBOL]");
    });
    it("#1522", () => {
        app.options.setValue("categorizeByGroup", true);
        const project = convert();
        (0, assert_1.deepStrictEqual)(project.groups?.map((g) => g.categories?.map((c) => c.title)), [["cat"]]);
    });
    it("#1524", () => {
        const project = convert();
        const nullableParam = (0, utils_1.query)(project, "nullable").signatures?.[0]
            ?.parameters?.[0];
        (0, assert_1.deepStrictEqual)(nullableParam?.type?.toString(), "null | string");
        const nonNullableParam = (0, utils_1.query)(project, "nonNullable").signatures?.[0]
            ?.parameters?.[0];
        (0, assert_1.deepStrictEqual)(nonNullableParam?.type?.toString(), "string");
    });
    it("#1534", () => {
        const project = convert();
        const func = (0, utils_1.query)(project, "gh1534");
        (0, assert_1.deepStrictEqual)(func.signatures?.[0]?.parameters?.[0]?.type?.toString(), "readonly [number, string]");
    });
    it("#1547", () => {
        const project = convert();
        (0, assert_1.deepStrictEqual)(project.children?.map((c) => c.name), ["Test", "ThingA", "ThingB"]);
    });
    it("#1552", () => {
        const project = convert();
        (0, assert_1.deepStrictEqual)((0, utils_1.query)(project, "emptyArr").defaultValue, "[]");
        (0, assert_1.deepStrictEqual)((0, utils_1.query)(project, "nonEmptyArr").defaultValue, "...");
        (0, assert_1.deepStrictEqual)((0, utils_1.query)(project, "emptyObj").defaultValue, "{}");
        (0, assert_1.deepStrictEqual)((0, utils_1.query)(project, "nonEmptyObj").defaultValue, "...");
    });
    it("#1578", () => {
        const project = convert();
        (0, assert_1.ok)((0, utils_1.query)(project, "notIgnored"));
        (0, assert_1.ok)(!project.getChildByName("ignored"), "Symbol re-exported from ignored file is ignored.");
    });
    it("#1580", () => {
        const project = convert();
        (0, assert_1.ok)((0, utils_1.query)(project, "B.prop").hasComment(), "Overwritten property with no comment should be inherited");
        (0, assert_1.ok)((0, utils_1.query)(project, "B.run").signatures?.[0]?.hasComment(), "Overwritten method with no comment should be inherited");
    });
    it("#1624", () => {
        const project = convert();
        // #1637
        (0, assert_1.deepStrictEqual)((0, utils_1.query)(project, "Bar.baz").kind, models_1.ReflectionKind.Property);
        (0, assert_1.deepStrictEqual)(models_1.Comment.combineDisplayParts((0, utils_1.query)(project, "Foo.baz").comment?.summary), "Some property style doc.", "Property methods declared in interface should still allow comment inheritance");
    });
    it("#1626", () => {
        const project = convert();
        const ctor = (0, utils_1.query)(project, "Foo.constructor");
        (0, assert_1.deepStrictEqual)(ctor.sources?.[0]?.line, 2);
        (0, assert_1.deepStrictEqual)(ctor.sources[0].character, 4);
    });
    it("#1651 Handles comment discovery with expando functions ", () => {
        const project = convert();
        (0, assert_1.deepStrictEqual)(project.children?.map((c) => c.name), ["bar"]);
        (0, assert_1.deepStrictEqual)(project.children[0].children?.map((c) => c.name), ["metadata", "fn"]);
        const comments = [
            (0, utils_1.query)(project, "bar"),
            (0, utils_1.query)(project, "bar.metadata"),
            (0, utils_1.querySig)(project, "bar.fn"),
            (0, utils_1.querySig)(project, "bar"),
        ].map((r) => models_1.Comment.combineDisplayParts(r.comment?.summary));
        (0, assert_1.deepStrictEqual)(comments, ["bar", "metadata", "fn", ""]);
    });
    it("#1660", () => {
        const project = convert();
        const alias = (0, utils_1.query)(project, "SomeType");
        (0, assert_1.ok)(alias.type instanceof models_1.QueryType);
        (0, assert_1.deepStrictEqual)(alias.type.queryType.name, "m.SomeClass.someProp");
    });
    it("#1733", () => {
        const project = convert();
        const alias = (0, utils_1.query)(project, "Foo");
        (0, assert_1.deepStrictEqual)(alias.typeParameters?.[0].comment?.summary, [
            { kind: "text", text: "T docs" },
        ]);
        const cls = (0, utils_1.query)(project, "Bar");
        (0, assert_1.deepStrictEqual)(cls.typeParameters?.[0].comment?.summary, [
            { kind: "text", text: "T docs" },
        ]);
    });
    it("#1734", () => {
        const project = convert();
        const alias = (0, utils_1.query)(project, "Foo");
        const expectedComment = new models_1.Comment();
        expectedComment.blockTags = [
            new models_1.CommentTag("@asdf", [
                { kind: "text", text: "Some example text" },
            ]),
        ];
        (0, assert_1.deepStrictEqual)(alias.comment, expectedComment);
        logger.expectMessage("warn: Encountered an unknown block tag @asdf");
    });
    it("#1745", () => {
        app.options.setValue("categorizeByGroup", true);
        const project = convert();
        const Foo = (0, utils_1.query)(project, "Foo");
        (0, assert_1.ok)(Foo.type instanceof models_1.ReflectionType, "invalid type");
        const group = project.groups?.find((g) => g.title === "Type Aliases");
        (0, assert_1.ok)(group, "missing group");
        const cat = group.categories?.find((cat) => cat.title === "My category");
        (0, assert_1.ok)(cat, "missing cat");
        (0, assert_1.ok)(cat.children.includes(Foo), "not included in cat");
        (0, assert_1.ok)(!Foo.comment?.getTag("@category"), "has cat tag");
        (0, assert_1.ok)(!Foo.type.declaration.comment?.getTag("@category"), "has cat tag 2");
        (0, assert_1.ok)(!Foo.type.declaration.signatures?.some((s) => s.comment?.getTag("@category")), "has cat tag 3");
    });
    it("#1770", () => {
        const project = convert();
        const sym1 = (0, utils_1.query)(project, "sym1");
        (0, assert_1.deepStrictEqual)(models_1.Comment.combineDisplayParts(sym1.comment?.summary), "Docs for Sym1");
        const sym2 = (0, utils_1.query)(project, "sym2");
        (0, assert_1.deepStrictEqual)(models_1.Comment.combineDisplayParts(sym2.comment?.summary), "Docs for Sym2");
    });
    it("#1771", () => {
        const project = convert();
        const check = (0, utils_1.query)(project, "check");
        const tag = check.comment?.summary[0];
        (0, assert_1.deepStrictEqual)(tag?.kind, "inline-tag");
        (0, assert_1.deepStrictEqual)(tag.text, "Test2.method");
        (0, assert_1.ok)(tag.target === (0, utils_1.query)(project, "Test.method"), "Incorrect resolution");
    });
    it("#1795", () => {
        const project = convert();
        (0, assert_1.deepStrictEqual)(project.children?.map((c) => c.name), ["default", "foo"]);
        (0, assert_1.ok)(project.children[0].kind === models_1.ReflectionKind.Reference);
        (0, assert_1.ok)(project.children[1].kind !== models_1.ReflectionKind.Reference);
    });
    it("#1804", () => {
        const project = convert();
        const foo = (0, utils_1.query)(project, "foo");
        const sig = foo.signatures?.[0];
        (0, assert_1.ok)(sig);
        const param = sig.parameters?.[0];
        (0, assert_1.ok)(param);
        (0, assert_1.ok)(param.flags.isOptional);
    });
    it("#1875", () => {
        const project = convert();
        const test = (0, utils_1.query)(project, "test");
        (0, assert_1.deepStrictEqual)(test.signatures?.[0].parameters?.map((p) => p.type?.toString()), ["typeof globalThis", "string"]);
        const test2 = (0, utils_1.query)(project, "test2");
        (0, assert_1.deepStrictEqual)(test2.signatures?.[0].parameters?.map((p) => p.type?.toString()), ["any", "string"]);
    });
    it("#1876", () => {
        const project = convert();
        const foo = (0, utils_1.query)(project, "foo");
        const fooSig = foo.signatures?.[0].parameters?.[0];
        (0, assert_1.ok)(fooSig);
        (0, assert_1.ok)(fooSig.type instanceof models_1.UnionType);
        (0, assert_1.ok)(fooSig.type.types[1] instanceof models_1.ReflectionType);
        (0, assert_1.deepStrictEqual)(models_1.Comment.combineDisplayParts(fooSig.type.types[1].declaration.getChildByName("min")?.comment
            ?.summary), "Nested");
        const bar = (0, utils_1.query)(project, "bar");
        const barSig = bar.signatures?.[0].parameters?.[0];
        (0, assert_1.ok)(barSig);
        (0, assert_1.ok)(barSig.type instanceof models_1.UnionType);
        (0, assert_1.ok)(barSig.type.types[0] instanceof models_1.ReflectionType);
        (0, assert_1.ok)(barSig.type.types[1] instanceof models_1.ReflectionType);
        (0, assert_1.deepStrictEqual)(models_1.Comment.combineDisplayParts(barSig.type.types[0].declaration.getChildByName("min")?.comment
            ?.summary), "Nested");
        (0, assert_1.deepStrictEqual)(models_1.Comment.combineDisplayParts(barSig.type.types[1].declaration.getChildByName("min")?.comment
            ?.summary), "Nested");
    });
    it("#1880", () => {
        const project = convert();
        const SomeEnum = (0, utils_1.query)(project, "SomeEnum");
        (0, assert_1.deepStrictEqual)(SomeEnum.kind, models_1.ReflectionKind.Enum);
        (0, assert_1.ok)(SomeEnum.hasComment(), "Missing @enum variable comment");
        const auto = (0, utils_1.query)(project, "SomeEnum.AUTO");
        (0, assert_1.ok)(auto.hasComment(), "Missing @enum member comment");
    });
    it("#1896", () => {
        const project = convert();
        const Type1 = (0, utils_1.query)(project, "Type1");
        const Type2 = (0, utils_1.query)(project, "Type2");
        (0, assert_1.deepStrictEqual)(Type1.type?.type, "reflection");
        (0, assert_1.deepStrictEqual)(Type2.type?.type, "reflection");
        (0, assert_1.deepStrictEqual)(Type1.comment, new models_1.Comment([{ kind: "text", text: "On Tag" }]));
        (0, assert_1.deepStrictEqual)(Type2.comment, new models_1.Comment([{ kind: "text", text: "Some type 2." }]));
    });
    it("#1898", () => {
        const project = convert();
        app.validate(project);
        logger.expectMessage("warn: UnDocFn (TypeAlias), defined in */gh1898.ts, does not have any documentation");
    });
    it("#1903", () => {
        const project = convert();
        (0, assert_1.deepStrictEqual)(Object.values(project.reflections).map((r) => r.name), ["typedoc"]);
    });
    it("#1903b", () => {
        const project = convert("gh1903b");
        (0, assert_1.deepStrictEqual)(Object.values(project.reflections).map((r) => r.name), ["typedoc"]);
    });
    it("#1907", () => {
        const project = convert();
        // gh2190 - we now skip the first package.json we encounter because it doesn't contain a name field.
        (0, assert_1.deepStrictEqual)(project.packageName, "typedoc");
    });
    it("#1913", () => {
        const project = convert();
        const fn = (0, utils_1.query)(project, "fn");
        (0, assert_1.deepStrictEqual)(fn.signatures?.[0].comment, new models_1.Comment([], [new models_1.CommentTag("@returns", [{ kind: "text", text: "ret" }])]));
    });
    it("#1927", () => {
        const project = convert();
        const ref = (0, utils_1.query)(project, "Derived.getter");
        (0, assert_1.deepStrictEqual)(ref.getSignature?.comment, new models_1.Comment([{ kind: "text", text: "Base" }]));
    });
    it("#1942", () => {
        const project = convert();
        (0, assert_1.deepStrictEqual)((0, utils_1.query)(project, "Foo.A").type, new models_1.LiteralType(0));
        (0, assert_1.deepStrictEqual)((0, utils_1.query)(project, "Foo.B").type, new models_1.IntrinsicType("number"));
        (0, assert_1.deepStrictEqual)((0, utils_1.query)(project, "Bar.C").type, new models_1.LiteralType("C"));
    });
    it("#1961", () => {
        const project = convert();
        (0, assert_1.deepStrictEqual)(models_1.Comment.combineDisplayParts((0, utils_1.query)(project, "WithDocs1").comment?.summary), "second");
    });
    it("#1962", () => {
        const project = convert();
        const foo = (0, utils_1.query)(project, "foo");
        (0, assert_1.ok)(foo.signatures);
        (0, assert_1.ok)(project.hasComment(), "Missing module comment");
        (0, assert_1.ok)(!foo.signatures[0].hasComment(), "Module comment attached to signature");
    });
    it("#1963", () => {
        const project = convert();
        (0, assert_1.ok)(project.hasComment(), "Missing module comment");
    });
    it("#1967", () => {
        const project = convert();
        (0, assert_1.deepStrictEqual)((0, utils_1.query)(project, "abc").comment, new models_1.Comment([], [
            new models_1.CommentTag("@example", [
                {
                    kind: "code",
                    text: "```ts\n\n```",
                },
            ]),
        ]));
    });
    it("#1968", () => {
        const project = convert();
        const comments = ["Bar.x", "Bar.y", "Bar.z"].map((n) => models_1.Comment.combineDisplayParts((0, utils_1.query)(project, n).comment?.summary));
        (0, assert_1.deepStrictEqual)(comments, ["getter", "getter", "setter"]);
    });
    it("#1973", () => {
        const project = convert();
        const comments = ["A", "B"].map((n) => models_1.Comment.combineDisplayParts((0, utils_1.query)(project, n).comment?.summary));
        (0, assert_1.deepStrictEqual)(comments, ["A override", "B module"]);
        const comments2 = ["A.a", "B.b"].map((n) => models_1.Comment.combineDisplayParts((0, utils_1.query)(project, n).comment?.summary));
        (0, assert_1.deepStrictEqual)(comments2, ["Comment for a", "Comment for b"]);
    });
    it("#1980", () => {
        const project = convert();
        const link = (0, utils_1.query)(project, "link");
        (0, assert_1.deepStrictEqual)(link.comment?.summary.filter((t) => t.kind === "inline-tag"), [
            {
                kind: "inline-tag",
                tag: "@link",
                target: "http://example.com",
                text: "http://example.com",
            },
            {
                kind: "inline-tag",
                tag: "@link",
                target: "http://example.com",
                text: "with text",
            },
            {
                kind: "inline-tag",
                tag: "@link",
                target: "http://example.com",
                text: "jsdoc support",
            },
        ]);
    });
    it("#1986", () => {
        const project = convert();
        const a = (0, utils_1.query)(project, "a");
        (0, assert_1.deepStrictEqual)(models_1.Comment.combineDisplayParts(a.comment?.summary), "[[include:file.md]] this is not a link.");
    });
    it("#1994", () => {
        app.options.setValue("excludeNotDocumented", true);
        const project = convert();
        for (const exp of ["documented", "documented2", "Docs.x", "Docs.y"]) {
            (0, utils_1.query)(project, exp);
        }
        for (const rem of ["notDocumented", "Docs.z"]) {
            (0, assert_1.ok)(!project.getChildByName(rem));
        }
        const y = (0, utils_1.query)(project, "Docs.y");
        (0, assert_1.deepStrictEqual)(y.sources?.length, 1);
        (0, assert_1.ok)(y.getSignature);
        (0, assert_1.ok)(!y.setSignature);
    });
    it("#1996", () => {
        const project = convert();
        const a = (0, utils_1.querySig)(project, "a");
        (0, assert_1.deepStrictEqual)(a.sources?.[0].fileName, "gh1996.ts");
        (0, assert_1.deepStrictEqual)(a.sources[0].line, 1);
        (0, assert_1.deepStrictEqual)(a.sources[0].character, 17);
        const b = (0, utils_1.querySig)(project, "b");
        (0, assert_1.deepStrictEqual)(b.sources?.[0].fileName, "gh1996.ts");
        (0, assert_1.deepStrictEqual)(b.sources[0].line, 3);
        (0, assert_1.deepStrictEqual)(b.sources[0].character, 16);
    });
    it("#2008", () => {
        const project = convert();
        const fn = (0, utils_1.query)(project, "myFn");
        (0, assert_1.deepStrictEqual)(models_1.Comment.combineDisplayParts(fn.comment?.summary), "Docs");
    });
    it("#2011", () => {
        const project = convert();
        const readable = (0, utils_1.query)(project, "Readable").signatures[0];
        const type = readable.type;
        (0, assert_1.deepStrictEqual)(type.type, "intersection");
        (0, assert_1.notDeepStrictEqual)(type.types[0], "intersection");
        (0, assert_1.notDeepStrictEqual)(type.types[1], "intersection");
    });
    it("#2012", () => {
        const project = convert();
        project.hasOwnDocument = true;
        const model = (0, utils_1.query)(project, "model");
        const Model = (0, utils_1.query)(project, "Model");
        (0, assert_1.deepStrictEqual)(model.getAlias(), "model");
        (0, assert_1.deepStrictEqual)(Model.getAlias(), "Model-1");
    });
    it("#2019", () => {
        const project = convert();
        const param = (0, utils_1.query)(project, "A.constructor").signatures[0]
            .parameters[0];
        const prop = (0, utils_1.query)(project, "A.property");
        (0, assert_1.deepStrictEqual)(models_1.Comment.combineDisplayParts(param.comment?.summary), "Param comment", "Constructor parameter");
        (0, assert_1.deepStrictEqual)(models_1.Comment.combineDisplayParts(prop.comment?.summary), "Param comment", "Property");
    });
    it("#2020", () => {
        const project = convert();
        const opt = (0, utils_1.query)(project, "Options");
        (0, assert_1.deepStrictEqual)(models_1.Comment.combineDisplayParts(opt.comment?.summary), "Desc");
        (0, assert_1.deepStrictEqual)(models_1.Comment.combineDisplayParts(opt.getChildByName("url")?.comment?.summary), "Desc2");
        (0, assert_1.deepStrictEqual)(models_1.Comment.combineDisplayParts(opt.getChildByName("apiKey")?.comment?.summary), "Desc3");
    });
    it("#2031", () => {
        const project = convert();
        const sig = (0, utils_1.query)(project, "MyClass.aMethod").signatures[0];
        const summaryLink = sig.comment?.summary[0];
        (0, assert_1.ok)(summaryLink?.kind === "inline-tag");
        (0, assert_1.ok)(summaryLink.target);
        const paramLink = sig.parameters[0].comment?.summary[0];
        (0, assert_1.ok)(paramLink?.kind === "inline-tag");
        (0, assert_1.ok)(paramLink.target);
    });
    it("#2033", () => {
        const project = convert();
        const cls = project.children.find((c) => c.name === "Foo" && c.kind === models_1.ReflectionKind.Class);
        (0, assert_1.ok)(cls);
        const link = cls.comment?.summary[0];
        (0, assert_1.ok)(link?.kind === "inline-tag");
        (0, assert_1.ok)(link.target);
    });
    it("#2036", () => {
        const project = convert();
        const SingleSimpleCtor = (0, utils_1.query)(project, "SingleSimpleCtor");
        const MultipleSimpleCtors = (0, utils_1.query)(project, "MultipleSimpleCtors");
        const AnotherCtor = (0, utils_1.query)(project, "AnotherCtor");
        (0, assert_1.deepStrictEqual)(SingleSimpleCtor.type?.type, "reflection");
        (0, assert_1.deepStrictEqual)(MultipleSimpleCtors.type?.type, "reflection");
        (0, assert_1.deepStrictEqual)(AnotherCtor.type?.type, "reflection");
        (0, assert_1.deepStrictEqual)(SingleSimpleCtor.type.declaration.signatures?.length, 1);
        (0, assert_1.deepStrictEqual)(MultipleSimpleCtors.type.declaration.signatures?.length, 2);
        (0, assert_1.deepStrictEqual)(AnotherCtor.type.declaration.signatures?.length, 1);
    });
    it("#2042", () => {
        const project = convert();
        for (const [name, docs, sigDocs] of [
            ["built", "", "inner docs"],
            ["built2", "outer docs", "inner docs"],
            ["fn", "", "inner docs"],
            ["fn2", "outer docs", "inner docs"],
        ]) {
            const refl = (0, utils_1.query)(project, name);
            (0, assert_1.ok)(refl.signatures?.[0]);
            (0, assert_1.deepStrictEqual)(models_1.Comment.combineDisplayParts(refl.comment?.summary), docs, name + " docs");
            (0, assert_1.deepStrictEqual)(models_1.Comment.combineDisplayParts(refl.signatures[0].comment?.summary), sigDocs, name + " sig docs");
        }
    });
    it("#2044", () => {
        const project = convert();
        for (const [name, ref] of [
            ["Foo", false],
            ["RenamedFoo", true],
            ["Generic", false],
            ["RenamedGeneric", true],
            ["NonGeneric", false],
        ]) {
            const decl = (0, utils_1.query)(project, name);
            (0, assert_1.deepStrictEqual)(decl instanceof models_1.ReferenceReflection, ref, `${name} = ${ref}`);
        }
    });
    it("#2064", () => {
        app.options.setValue("excludePrivate", false);
        const project = convert();
        (0, utils_1.query)(project, "PrivateCtorDecl.x");
    });
    it("#2079", () => {
        const project = convert();
        const cap = (0, utils_1.query)(project, "capitalize");
        const sig = cap.signatures[0];
        (0, assert_1.deepStrictEqual)(sig.type?.toString(), "Capitalize<T>");
    });
    it("#2087", () => {
        const project = convert();
        const x = (0, utils_1.query)(project, "Bar.x");
        (0, assert_1.deepStrictEqual)(models_1.Comment.combineDisplayParts(x.comment?.summary), "Foo type comment");
    });
    it("#2106 Handles types/values with same name ", () => {
        const project = convert();
        const balance = (0, utils_1.querySig)(project, "balance");
        (0, assert_1.deepStrictEqual)(balance.type?.type, "reference");
        (0, assert_1.deepStrictEqual)(balance.type.reflection?.kind, models_1.ReflectionKind.Interface);
        const TypeOf = (0, utils_1.query)(project, "TypeOf");
        (0, assert_1.deepStrictEqual)(TypeOf.type?.type, "query");
        (0, assert_1.deepStrictEqual)(TypeOf.type.queryType.reflection?.kind, models_1.ReflectionKind.Variable);
    });
    it("#2135", () => {
        const project = convert();
        const hook = (0, utils_1.query)(project, "Camera.useCameraPermissions");
        (0, assert_1.deepStrictEqual)(hook.type?.type, "reflection");
        (0, assert_1.deepStrictEqual)(models_1.Comment.combineDisplayParts(hook.comment?.summary), "One");
    });
    it("#2150", () => {
        const project = convert();
        const intFn = (0, utils_1.query)(project, "FileInt.intFn");
        (0, assert_1.deepStrictEqual)(intFn.kind, models_1.ReflectionKind.Method, "intFn interface method");
        (0, assert_1.deepStrictEqual)(models_1.Comment.combineDisplayParts(intFn.signatures?.[0].comment?.summary), "intFn doc");
        const intProp = (0, utils_1.query)(project, "FileInt.intVar");
        (0, assert_1.deepStrictEqual)(intProp.kind, models_1.ReflectionKind.Property, "intVar interface prop");
        (0, assert_1.deepStrictEqual)(models_1.Comment.combineDisplayParts(intProp.comment?.summary), "intVar doc");
        const constFn = (0, utils_1.query)(project, "FileInt.constFn");
        (0, assert_1.deepStrictEqual)(constFn.kind, models_1.ReflectionKind.Method, "constFn interface method");
        (0, assert_1.deepStrictEqual)(models_1.Comment.combineDisplayParts(constFn.signatures?.[0].comment?.summary), "constFn doc");
        const intFn2 = (0, utils_1.query)(project, "FileClass.intFn");
        (0, assert_1.deepStrictEqual)(intFn2.kind, models_1.ReflectionKind.Method, "intFn class method");
        const intProp2 = (0, utils_1.query)(project, "FileClass.intVar");
        (0, assert_1.deepStrictEqual)(intProp2.kind, models_1.ReflectionKind.Property, "intVar class prop");
        const constFn2 = (0, utils_1.query)(project, "FileClass.constFn");
        (0, assert_1.deepStrictEqual)(constFn2.kind, models_1.ReflectionKind.Method, "constFn class method");
        (0, assert_1.deepStrictEqual)(models_1.Comment.combineDisplayParts(constFn2.signatures?.[0].comment?.summary), "constFn doc");
    });
    it("#2156", () => {
        app.options.setValue("excludeNotDocumented", true);
        const project = convert();
        const foo = (0, utils_1.query)(project, "foo");
        (0, assert_1.deepStrictEqual)(foo.signatures?.length, 1);
        (0, assert_1.deepStrictEqual)(models_1.Comment.combineDisplayParts(foo.comment?.summary), "Is documented");
    });
    it("#2165 module comments on global files", () => {
        const project = convert();
        (0, assert_1.deepStrictEqual)(models_1.Comment.combineDisplayParts(project.comment?.summary), "'module' comment");
    });
    it("#2175", () => {
        const project = convert();
        const def = (0, utils_1.query)(project, "default");
        (0, assert_1.deepStrictEqual)(def.type?.type, "intrinsic");
        (0, assert_1.deepStrictEqual)(def.type.toString(), "undefined");
    });
    it("#2200", () => {
        const project = convert();
        const Test = (0, utils_1.query)(project, "Test");
        (0, assert_1.deepStrictEqual)(Test.type?.type, "reflection");
        (0, assert_1.deepStrictEqual)(Test.type.declaration.getChildByName("x")?.flags.isOptional, true);
    });
    it("#2207", () => {
        const project = convert();
        const mod = (0, utils_1.query)(project, "Mod");
        (0, assert_1.deepStrictEqual)(mod.sources?.[0].line, 1);
    });
    it("#2220", () => {
        const project = convert();
        const fn = (0, utils_1.query)(project, "createAssetEmitter");
        const param = fn.signatures?.[0].parameters?.[0];
        (0, assert_1.ok)(param);
        (0, assert_1.deepStrictEqual)(param.type?.type, "query");
        (0, assert_1.deepStrictEqual)(param.type.queryType.reflection?.name, "TypeEmitter");
    });
    it("#2222", () => {
        const project = convert();
        const example = (0, utils_1.query)(project, "example");
        (0, assert_1.deepStrictEqual)(models_1.Comment.combineDisplayParts(example.comment?.getTag("@example")?.content), "```ts\nlet x = `str`\n```");
    });
    it("#2233", () => {
        const project = convert();
        const int = (0, utils_1.query)(project, "Int");
        const cls = (0, utils_1.query)(project, "IntImpl");
        for (const name of ["prop", "prop2", "method", "method2"]) {
            const intFn = int.getChildByName(name);
            const clsFn = cls.getChildByName(name);
            (0, assert_1.deepStrictEqual)(clsFn.implementationOf?.reflection?.getFullName(), intFn.getFullName(), `${name} method not properly linked`);
            const intTarget = intFn.signatures?.[0] || intFn;
            const clsSig = clsFn.signatures?.[0] ||
                clsFn.type?.visit({
                    reflection: (r) => r.declaration.signatures?.[0],
                });
            (0, assert_1.deepStrictEqual)(clsSig.implementationOf?.reflection?.getFullName(), intTarget.getFullName(), `${name} signature not properly linked`);
        }
    });
    it("#2234 Handles implementationOf with symbols ", () => {
        const project = convert();
        const cm = (0, utils_1.query)(project, "CharMap");
        (0, assert_1.deepStrictEqual)(cm.children?.map((c) => c.name), ["constructor", "[iterator]", "at"]);
        (0, assert_1.deepStrictEqual)(cm.children[1].implementationOf?.name, "ReadonlyCharMap.[iterator]");
    });
    it("#2270 Handles http links with TS link resolution ", () => {
        const project = convert();
        const links = (0, utils_1.getLinks)((0, utils_1.query)(project, "A"));
        (0, assert_1.deepStrictEqual)(links, [
            {
                display: "Immutable",
                target: [models_1.ReflectionKind.TypeAlias, "Immutable"],
            },
            {
                display: "Immutable Objects",
                target: "https://en.wikipedia.org/wiki/Immutable_object",
            },
        ]);
    });
    it("#2290 Handles comments on interfaces with call signatures ", () => {
        const project = convert();
        (0, assert_1.deepStrictEqual)((0, utils_1.getComment)(project, "CallSignature"), "Int comment");
        (0, assert_1.deepStrictEqual)((0, utils_1.getComment)(project, "CallSignature2"), "Int comment");
        (0, assert_1.deepStrictEqual)((0, utils_1.getComment)(project, "CallSignature2.prop"), "Prop comment");
        (0, assert_1.deepStrictEqual)(models_1.Comment.combineDisplayParts((0, utils_1.query)(project, "CallSignature").signatures[0].comment?.summary), "Sig comment");
        (0, assert_1.deepStrictEqual)(models_1.Comment.combineDisplayParts((0, utils_1.query)(project, "CallSignature2").signatures[0].comment
            ?.summary), "Sig comment");
    });
    it("#2291 Does not warn on notDocumented edge case ", () => {
        app.options.setValue("validation", { notDocumented: true });
        const project = convert();
        app.validate(project);
        logger.expectNoOtherMessages();
    });
    it("#2296 Supports TS 5.0 ", () => {
        const project = convert();
        const names = (0, utils_1.query)(project, "names");
        (0, assert_1.deepStrictEqual)(names.type?.toString(), 'readonly ["Alice", "Bob", "Eve"]');
        const getNamesExactly = (0, utils_1.query)(project, "getNamesExactly");
        const sig = getNamesExactly.signatures[0];
        const tp = sig.typeParameters[0];
        (0, assert_1.deepStrictEqual)(tp.flags.isConst, true);
    });
    it("#2307 Detects source locations coming from types and prefers value declarations, ", () => {
        const project = convert();
        const getLines = (name) => {
            const refl = (0, utils_1.query)(project, name);
            return refl.signatures?.flatMap((sig) => sig.sources.map((src) => src.line));
        };
        (0, assert_1.deepStrictEqual)(getLines("double"), [3]);
        (0, assert_1.deepStrictEqual)(getLines("foo"), [5]);
        (0, assert_1.deepStrictEqual)(getLines("all"), [8, 9]);
    });
    it("#2320 Uses type parameters from parent class in arrow-methods, ", () => {
        const project = convert();
        const arrow = (0, utils_1.querySig)(project, "ResolvedSubclass.arrowFunction");
        (0, assert_1.deepStrictEqual)(arrow.typeParameters[0].type?.toString(), '"one" | "two"');
    });
    it("#2336 Handles comments with nested methods ", () => {
        const project = convert();
        const outer = (0, utils_1.querySig)(project, "ClassVersion.outer");
        (0, assert_1.deepStrictEqual)(models_1.Comment.combineDisplayParts(outer.comment?.summary), "Outer");
        (0, assert_1.deepStrictEqual)(outer.type?.type, "reflection");
        (0, assert_1.deepStrictEqual)(models_1.Comment.combineDisplayParts(outer.type.declaration.signatures[0].comment?.summary), "");
    });
    it("#2360 Supports nested paths with tsLinkResolution ", () => {
        const project = convert();
        const x = (0, utils_1.query)(project, "x");
        const link = x.comment?.summary[0];
        (0, assert_1.deepStrictEqual)(link?.kind, "inline-tag");
        (0, assert_1.deepStrictEqual)(link.target, (0, utils_1.query)(project, "Foo.bar"));
    });
    it("#2364 Handles duplicate declarations with @namespace ", () => {
        const project = convert();
        (0, assert_1.deepStrictEqual)(project.children?.map((c) => c.name), ["NS", "NS2", "NS2"]);
        const ns = (0, utils_1.query)(project, "NS");
        (0, assert_1.deepStrictEqual)(ns.children?.map((c) => c.name), ["T", "property"]);
    });
    it("#2364 Gets properties when types/variables are merged with @namespace ", () => {
        const project = convert();
        const ns = project.children?.find((c) => c.name == "NS2" && c.kind == models_1.ReflectionKind.Namespace);
        (0, assert_1.deepStrictEqual)(ns?.children?.map((c) => c.name), ["property"]);
    });
    it("#2372 Puts delegate type alias comments on the type alias ", () => {
        const project = convert();
        (0, assert_1.deepStrictEqual)((0, utils_1.getComment)(project, "EventHandler"), "The signature for a function acting as an event handler.");
        const typeSig = (0, utils_1.query)(project, "EventHandler").type?.visit({
            reflection(r) {
                return r.declaration.signatures[0];
            },
        });
        (0, assert_1.deepStrictEqual)(models_1.Comment.combineDisplayParts(typeSig?.comment?.summary), "");
    });
    it("#2384 Handles spaces in JSDoc default parameter names ", () => {
        const project = convert();
        const Typed = (0, utils_1.query)(project, "Typed");
        (0, assert_1.deepStrictEqual)(Typed.typeParameters?.length, 1);
        (0, assert_1.deepStrictEqual)(models_1.Comment.combineDisplayParts(Typed.typeParameters[0].comment?.summary), "desc");
    });
    it("#2389 Handles @template parameter constraints correctly, ", () => {
        const project = convert();
        const foo = (0, utils_1.query)(project, "foo");
        (0, assert_1.deepStrictEqual)(foo.signatures?.length, 1);
        (0, assert_1.deepStrictEqual)(foo.signatures[0].typeParameters?.length, 2);
        const [T, U] = foo.signatures[0].typeParameters;
        (0, assert_1.deepStrictEqual)(T.type?.toString(), "string");
        (0, assert_1.deepStrictEqual)(U.type?.toString(), undefined);
    });
    // This is rather unfortunate, we need to do this so that files which include only
    // a single declare module can still have a comment on them, but it looks really
    // weird and wrong if there are multiple declare module statements in a file...
    // there's probably some nicer way of doing this that I'm not seeing right now.
    it("#2401 Uses module comment discovery on 'declare module \"foo\"' ", () => {
        const project = convert();
        (0, assert_1.deepStrictEqual)(models_1.Comment.combineDisplayParts(project.comment?.summary), "Comment for module");
    });
    it("#2414 Includes index signature comments ", () => {
        const project = convert();
        (0, assert_1.deepStrictEqual)(models_1.Comment.combineDisplayParts((0, utils_1.query)(project, "ObjectWithIndexSignature").indexSignatures?.[0]
            ?.comment?.summary), "Index comment.");
    });
    it("#2430 Handles destructured object parameter defaults, ", () => {
        const project = convert();
        const Checkbox = (0, utils_1.querySig)(project, "Checkbox");
        (0, assert_1.deepStrictEqual)(Checkbox.parameters?.length, 1);
        (0, assert_1.deepStrictEqual)(Checkbox.parameters[0].name, "props");
        const type = Checkbox.parameters[0].type;
        (0, assert_1.deepStrictEqual)(type?.type, "reflection");
        (0, assert_1.deepStrictEqual)(type.declaration.children?.map((c) => c.name), ["falseValue", "trueValue", "value"]);
        (0, assert_1.deepStrictEqual)(type.declaration.children.map((c) => c.defaultValue), ["false", "true", undefined]);
    });
    it("#2436 Handles function-namespaces created with Object.assign ", () => {
        const project = convert();
        (0, assert_1.deepStrictEqual)((0, utils_1.query)(project, "bug").kind, models_1.ReflectionKind.Function);
        const foo = (0, utils_1.query)(project, "bug.foo");
        const bar = (0, utils_1.query)(project, "bug.bar");
        // It'd be kind of nice if foo became a method, but the symbol only has
        // a Property flag, and there are other nicer ways to formulate this that do.
        (0, assert_1.deepStrictEqual)(foo.kind, models_1.ReflectionKind.Property, "method");
        (0, assert_1.deepStrictEqual)(bar.kind, models_1.ReflectionKind.Property, "property");
    });
    it("#2437 Does not warn due to the diamond problem in comment discovery ", () => {
        convert();
        logger.expectNoOtherMessages();
    });
    it("#2438 Handles recursive aliases without looping infinitely ", () => {
        const bad = (0, utils_1.query)(convert(), "Bad");
        (0, assert_1.deepStrictEqual)(bad.kind, models_1.ReflectionKind.Interface);
    });
    it("#2444 Handles transient symbols correctly, ", () => {
        const project = convert();
        const boolEq = (0, utils_1.query)(project, "Boolean.equal");
        const numEq = (0, utils_1.query)(project, "Number.equal");
        (0, assert_1.deepStrictEqual)(boolEq.signatures[0].parameters[0].type?.toString(), "boolean");
        (0, assert_1.deepStrictEqual)(numEq.signatures[0].parameters[0].type?.toString(), "number");
    });
    it("#2451 Handles unions created due to union within intersection, ", () => {
        const project = convert();
        const is = (0, utils_1.querySig)(project, "FooA.is");
        (0, assert_1.deepStrictEqual)(is.type?.toString(), "this is Foo & Object");
    });
    it("#2466 Does not care about conversion order for @link resolution, ", () => {
        const project = convert();
        const Two = (0, utils_1.query)(project, "Two");
        (0, assert_1.deepStrictEqual)((0, utils_1.getLinks)(Two), [
            {
                display: "method1",
                target: [models_1.ReflectionKind.Method, "Two.method1"],
            },
        ]);
        const Three = (0, utils_1.query)(project, "Three");
        (0, assert_1.deepStrictEqual)((0, utils_1.getLinks)(Three), [
            {
                display: "method2",
                target: [models_1.ReflectionKind.Method, "Three.method2"],
            },
        ]);
    });
    it("#2476 Creates a separate namespace for `declare namespace` case ", () => {
        const project = convert();
        (0, assert_1.deepStrictEqual)(project.children?.map((c) => [c.name, c.kind]), [
            ["test", models_1.ReflectionKind.Namespace],
            ["test", models_1.ReflectionKind.Function],
        ]);
        (0, assert_1.deepStrictEqual)(project.children[0].children?.map((c) => c.name), ["Options"]);
    });
    it("#2478 Creates a separate namespace for `declare namespace` case with variables ", () => {
        const project = convert();
        (0, assert_1.deepStrictEqual)(project.children?.map((c) => [c.name, c.kind]), [
            ["test", models_1.ReflectionKind.Namespace],
            ["test", models_1.ReflectionKind.Function],
        ]);
        (0, assert_1.deepStrictEqual)(project.children[0].children?.map((c) => c.name), ["Options"]);
    });
    it("#2495 Does not crash when rendering recursive hierarchy, ", () => {
        const project = convert();
        const theme = new __1.DefaultTheme(app.renderer);
        const page = new __1.PageEvent(project);
        page.project = project;
        const context = theme.getRenderContext(page);
        context.hierarchyTemplate(page);
    });
    it("#2496 Correctly cleans up references to functions ", () => {
        app.options.setValue("excludeNotDocumented", true);
        convert();
    });
    it("#2502 Sorts literal numeric unions when converting a type, ", () => {
        const project = convert();
        const refl = (0, utils_1.query)(project, "Test");
        (0, assert_1.deepStrictEqual)(refl.type?.toString(), "1 | 2 | 3");
    });
    it("#2507 Handles an infinitely recursive type, ", () => {
        const project = convert();
        const type = (0, utils_1.querySig)(project, "fromPartial").typeParameters[0].type;
        // function fromPartial<I extends Value & {
        //     values: Value[] & (Value & {
        //         values: Value[] & (Value & {
        //             values: Value[] & (Value & {
        //                 values: Value[] & (Value & {
        //                     ...;
        //                 })[];
        //             })[];
        //         })[];
        //     })[];
        // }>(object: I): void
        (0, assert_1.deepStrictEqual)(type?.toString(), "Value & Object");
    });
    it("#2508 Handles constructed references to enumeration types, ", () => {
        const project = convert();
        const refl = (0, utils_1.query)(project, "Bar.color");
        (0, assert_1.deepStrictEqual)(refl.type?.type, "reference");
        (0, assert_1.deepStrictEqual)(refl.type.toString(), "Color");
        (0, assert_1.deepStrictEqual)(refl.type.reflection?.id, (0, utils_1.query)(project, "Color").id);
    });
    it("#2509 Does not duplicate comments due to signatures being present, ", () => {
        const project = convert();
        const cb = (0, utils_1.query)(project, "Int.cb");
        (0, assert_1.deepStrictEqual)(models_1.Comment.combineDisplayParts(cb.comment?.summary), "Cb");
        (0, assert_1.deepStrictEqual)(cb.type?.type, "reflection");
        (0, assert_1.deepStrictEqual)(cb.type.declaration.signatures[0].comment, undefined);
        const nested = (0, utils_1.query)(project, "Int.nested");
        (0, assert_1.deepStrictEqual)(nested.type?.type, "reflection");
        const cb2 = nested.type.declaration.children[0];
        (0, assert_1.deepStrictEqual)(models_1.Comment.combineDisplayParts(cb2.comment?.summary), "Cb2");
        (0, assert_1.deepStrictEqual)(cb2.type?.type, "reflection");
        (0, assert_1.deepStrictEqual)(cb2.type.declaration.signatures[0].comment, undefined);
    });
    it("#2521 Specifying comment on variable still inherits signature comments, ", () => {
        const project = convert();
        (0, assert_1.deepStrictEqual)((0, utils_1.getComment)(project, "fooWithoutComment"), "");
        (0, assert_1.deepStrictEqual)((0, utils_1.getSigComment)(project, "fooWithoutComment", 0), "Overload 1");
        (0, assert_1.deepStrictEqual)((0, utils_1.getSigComment)(project, "fooWithoutComment", 1), "Overload 2");
        (0, assert_1.deepStrictEqual)((0, utils_1.getComment)(project, "fooWithComment"), "New comment.");
        (0, assert_1.deepStrictEqual)((0, utils_1.getSigComment)(project, "fooWithComment", 0), "Overload 1");
        (0, assert_1.deepStrictEqual)((0, utils_1.getSigComment)(project, "fooWithComment", 1), "Overload 2");
    });
    it("#2545 discovers comments from non-exported 'parent' methods", () => {
        const project = convert();
        (0, assert_1.deepStrictEqual)((0, utils_1.getSigComment)(project, "Child.notAbstract"), "notAbstract docs");
        (0, assert_1.deepStrictEqual)((0, utils_1.getSigComment)(project, "Child.notAbstract2"), "notAbstract2 docs");
        (0, assert_1.deepStrictEqual)((0, utils_1.getSigComment)(project, "Child.isAbstract"), "isAbstract docs");
        (0, assert_1.deepStrictEqual)((0, utils_1.getComment)(project, "Child.abstractProperty"), "abstractProperty docs");
        // #2084
        (0, assert_1.deepStrictEqual)((0, utils_1.querySig)(project, "Bar.isInternal").comment?.hasModifier("@internal"), true);
    });
    it("#2552 Ignores @license and @import comments, ", () => {
        const project = convert();
        (0, assert_1.deepStrictEqual)(models_1.Comment.combineDisplayParts(project.comment?.summary), "This is an awesome module.");
        (0, assert_1.deepStrictEqual)((0, utils_1.getComment)(project, "something"), "");
    });
    it("#2553 Does not warn about documented constructor signature type aliases, ", () => {
        const project = convert();
        app.validate(project);
        logger.expectNoOtherMessages();
    });
    it("#2574 default export", () => {
        const project = convert();
        const sig = (0, utils_1.querySig)(project, "usesDefaultExport");
        const param = sig.parameters?.[0];
        (0, assert_1.ok)(param, "Missing parameter");
        (0, assert_1.deepStrictEqual)(param.name, "param", "Incorrect parameter name");
        (0, assert_1.deepStrictEqual)(param.type?.type, "reference", "Parameter is not a reference type");
        (0, assert_1.deepStrictEqual)(param.type.name, "DefaultExport", "Incorrect reference name");
        (0, assert_1.deepStrictEqual)(param.type.qualifiedName, "default", "Incorrect qualified name");
    });
    it("#2574 not default export", () => {
        const project = convert();
        const sig = (0, utils_1.querySig)(project, "usesNonDefaultExport");
        const param = sig.parameters?.[0];
        (0, assert_1.ok)(param, "Missing parameter");
        (0, assert_1.deepStrictEqual)(param.name, "param", "Incorrect parameter name");
        (0, assert_1.deepStrictEqual)(param.type?.type, "reference", "Parameter is not a reference type");
        (0, assert_1.deepStrictEqual)(param.type.name, "NotDefaultExport", "Incorrect reference name");
        (0, assert_1.deepStrictEqual)(param.type.qualifiedName, "NotDefaultExport", "Incorrect qualified name");
    });
    it("#2582 nested @namespace", () => {
        const project = convert();
        (0, utils_1.equalKind)((0, utils_1.query)(project, "f32"), models_1.ReflectionKind.Namespace);
        (0, utils_1.equalKind)((0, utils_1.query)(project, "f32.a"), models_1.ReflectionKind.Namespace);
        (0, utils_1.equalKind)((0, utils_1.query)(project, "f32.a.member"), models_1.ReflectionKind.Variable);
        (0, utils_1.equalKind)((0, utils_1.query)(project, "f32.a.fn"), models_1.ReflectionKind.Function);
        (0, utils_1.equalKind)((0, utils_1.query)(project, "f32.b"), models_1.ReflectionKind.Namespace);
        (0, utils_1.equalKind)((0, utils_1.query)(project, "f32.b.member"), models_1.ReflectionKind.Reference); // Somewhat odd, but not wrong...
        (0, utils_1.equalKind)((0, utils_1.query)(project, "f32.b.fn"), models_1.ReflectionKind.Function);
        (0, assert_1.deepStrictEqual)((0, utils_1.getComment)(project, "f32"), "f32 comment");
        (0, assert_1.deepStrictEqual)((0, utils_1.getComment)(project, "f32.a"), "A comment");
        (0, assert_1.deepStrictEqual)((0, utils_1.getComment)(project, "f32.a.member"), "Member comment");
        (0, assert_1.deepStrictEqual)((0, utils_1.getComment)(project, "f32.a.fn"), "Fn comment");
        (0, assert_1.deepStrictEqual)((0, utils_1.getComment)(project, "f32.b"), "B comment");
    });
    it("#2585 supports comments on union members", () => {
        const project = convert();
        const Foo = (0, utils_1.query)(project, "Foo");
        (0, assert_1.deepStrictEqual)(Foo.type?.type, "union");
        (0, assert_1.deepStrictEqual)(Foo.type.elementSummaries?.length, 2);
        (0, assert_1.deepStrictEqual)(Foo.type.elementSummaries.map(models_1.Comment.combineDisplayParts), [
            "Doc of foo1.",
            "Doc of foo2.",
        ]);
    });
    it("#2587 comment on shorthand property declaration", () => {
        const project = convert();
        const sig = (0, utils_1.querySig)(project, "foo");
        (0, assert_1.deepStrictEqual)(sig.type?.type, "reflection");
        const x = sig.type.declaration.getChildByName("x");
        (0, assert_1.ok)(x);
        (0, assert_1.deepStrictEqual)(models_1.Comment.combineDisplayParts(x.comment?.summary), "Shorthand comment");
    });
    it("#2603 handles @author tag", () => {
        const project = convert();
        const x = (0, utils_1.query)(project, "x");
        (0, assert_1.deepStrictEqual)(x.comment?.getTag("@author"), new models_1.CommentTag("@author", [{ kind: "text", text: "Ian Awesome" }]));
        logger.expectNoOtherMessages();
    });
    it("#2611 can suppress warnings from comments in declaration files", () => {
        convert();
        logger.expectMessage("warn: Encountered an unknown block tag @tagThatIsNotDefined");
        logger.expectNoOtherMessages();
        logger.reset();
        app.options.setValue("suppressCommentWarningsInDeclarationFiles", true);
        convert();
        logger.expectNoOtherMessages();
    });
    it("#2614 supports @since tag", () => {
        const project = convert();
        const foo = (0, utils_1.querySig)(project, "foo");
        (0, assert_1.deepStrictEqual)(foo.comment?.getTag("@since"), new models_1.CommentTag("@since", [{ kind: "text", text: "1.0.0" }]));
        logger.expectNoOtherMessages();
    });
    it("#2631 handles CRLF line endings in frontmatter", () => {
        const project = convert();
        (0, assert_1.deepStrictEqual)(project.documents?.map((d) => d.name), ["Windows Line Endings"]);
    });
    it("#2634 handles @hidden on function implementations", () => {
        const project = convert();
        (0, assert_1.deepStrictEqual)(project.children?.map((c) => c.name) || [], []);
    });
    it("#2636 does not treat parameters as class properties", () => {
        const project = convert();
        const sig = (0, utils_1.querySig)(project, "B.constructor");
        (0, assert_1.deepStrictEqual)(sig.parameters?.length, 1);
    });
    it("#2638 empty markdown file", () => {
        const project = convert();
        (0, assert_1.deepStrictEqual)(project.documents?.map((d) => d.content), [[]]);
    });
    it("#2644 allows comments on signature parents to count for being documented", () => {
        app.options.setValue("validation", { notDocumented: true });
        const project = convert();
        app.validate(project);
        logger.expectNoOtherMessages();
    });
    it("#2681 reports warnings on @link tags which resolve to a type not included in the documentation", () => {
        const project = convert();
        app.options.setValue("validation", false);
        app.options.setValue("validation", { invalidLink: true });
        app.validate(project);
        logger.expectMessage('warn: Failed to resolve link to "Generator" in comment for bug');
    });
    it("#2683 supports @param on parameters with functions", () => {
        const project = convert();
        const action = (0, utils_1.querySig)(project, "action");
        const callback = action.parameters[0];
        (0, assert_1.deepStrictEqual)(models_1.Comment.combineDisplayParts(callback.comment?.summary), "Param comment");
        (0, assert_1.deepStrictEqual)(callback.type?.type, "reflection");
        const data = callback.type.declaration.signatures[0].parameters[0];
        (0, assert_1.deepStrictEqual)(models_1.Comment.combineDisplayParts(data?.comment?.summary), "Data");
        const action2 = (0, utils_1.querySig)(project, "action2");
        const callback2 = action2.parameters[0];
        (0, assert_1.deepStrictEqual)(models_1.Comment.combineDisplayParts(callback2.comment?.summary), "Param comment2");
        (0, assert_1.deepStrictEqual)(callback2.type?.type, "reflection");
        const data2 = callback2.type.declaration.signatures[0].parameters[0];
        // Overwritten by the @param on the wrapping signature, so we never
        // had a chance to copy the data's @param to the parameter.
        (0, assert_1.deepStrictEqual)(data2.comment, undefined);
    });
});
