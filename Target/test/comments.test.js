"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = require("assert");
const typescript_1 = __importDefault(require("typescript"));
const blockLexer_1 = require("../lib/converter/comments/blockLexer");
const lexer_1 = require("../lib/converter/comments/lexer");
const lineLexer_1 = require("../lib/converter/comments/lineLexer");
const parser_1 = require("../lib/converter/comments/parser");
const rawLexer_1 = require("../lib/converter/comments/rawLexer");
const tagName_1 = require("../lib/converter/comments/tagName");
const models_1 = require("../lib/models");
const FileRegistry_1 = require("../lib/models/FileRegistry");
const minimalSourceFile_1 = require("../lib/utils/minimalSourceFile");
const TestLogger_1 = require("./TestLogger");
function dedent(text) {
    const lines = text.split(/\r?\n/);
    while (lines.length && lines[0].search(/\S/) === -1) {
        lines.shift();
    }
    while (lines.length && lines[lines.length - 1].search(/\S/) === -1) {
        lines.pop();
    }
    const minIndent = lines.reduce((indent, line) => line.length ? Math.min(indent, line.search(/\S/)) : indent, Infinity);
    return lines.map((line) => line.substring(minIndent)).join("\n");
}
describe("Dedent test helper", () => {
    it("Works on empty string", () => {
        (0, assert_1.deepStrictEqual)(dedent(""), "");
    });
    it("Works with indented text", () => {
        (0, assert_1.deepStrictEqual)(dedent(`
            Text here
        `), "Text here");
    });
    it("Works with multiple lines", () => {
        (0, assert_1.deepStrictEqual)(dedent(`
            Text here
                More indented
        `), "Text here\n    More indented");
    });
});
describe("Block Comment Lexer", () => {
    function lex(text) {
        return Array.from((0, blockLexer_1.lexBlockComment)(text));
    }
    it("Should handle an empty comment", () => {
        const tokens = lex("/**/");
        (0, assert_1.deepStrictEqual)(tokens, []);
        const tokens2 = lex("/***/");
        (0, assert_1.deepStrictEqual)(tokens2, []);
        const tokens3 = lex("/**  */");
        (0, assert_1.deepStrictEqual)(tokens3, []);
    });
    it("Should handle a trivial comment", () => {
        const tokens = lex("/** Comment */");
        (0, assert_1.deepStrictEqual)(tokens, [
            { kind: lexer_1.TokenSyntaxKind.Text, text: "Comment", pos: 4 },
        ]);
    });
    it("Should handle a multiline comment without stars", () => {
        const tokens = lex("/* Comment\nNext line */");
        (0, assert_1.deepStrictEqual)(tokens, [
            { kind: lexer_1.TokenSyntaxKind.Text, text: "Comment", pos: 3 },
            { kind: lexer_1.TokenSyntaxKind.NewLine, text: "\n", pos: 10 },
            { kind: lexer_1.TokenSyntaxKind.Text, text: "Next line", pos: 11 },
        ]);
    });
    it("Should handle a multiline comment with stars", () => {
        const tokens = lex("/*\n * Comment\n * Next line */");
        (0, assert_1.deepStrictEqual)(tokens, [
            { kind: lexer_1.TokenSyntaxKind.Text, text: "Comment", pos: 6 },
            { kind: lexer_1.TokenSyntaxKind.NewLine, text: "\n", pos: 13 },
            { kind: lexer_1.TokenSyntaxKind.Text, text: "Next line", pos: 17 },
        ]);
    });
    it("Should handle an indented comment with stars", () => {
        const tokens = lex(`/**
            * Text
            */`);
        (0, assert_1.deepStrictEqual)(tokens, [{ kind: lexer_1.TokenSyntaxKind.Text, text: "Text", pos: 18 }]);
    });
    it("Should handle an indented comment without stars", () => {
        const tokens = lex(`/*
            Text
            */`);
        (0, assert_1.deepStrictEqual)(tokens, [{ kind: lexer_1.TokenSyntaxKind.Text, text: "Text", pos: 15 }]);
    });
    it("Should handle a list within a comment without stars", () => {
        const tokens = lex(dedent(`
            /*
             Comment start
              * This is a list item
            */
        `));
        (0, assert_1.deepStrictEqual)(tokens, [
            { kind: lexer_1.TokenSyntaxKind.Text, text: "Comment start", pos: 4 },
            { kind: lexer_1.TokenSyntaxKind.NewLine, text: "\n", pos: 17 },
            {
                kind: lexer_1.TokenSyntaxKind.Text,
                text: " * This is a list item",
                pos: 19,
            },
        ]);
    });
    it("Should handle higher detected indentation than the rest of the comment", () => {
        const tokens = lex(dedent(`
        /*
             A
        B
            */
        `));
        (0, assert_1.deepStrictEqual)(tokens, [
            { kind: lexer_1.TokenSyntaxKind.Text, text: "A", pos: 8 },
            { kind: lexer_1.TokenSyntaxKind.NewLine, text: "\n", pos: 9 },
            { kind: lexer_1.TokenSyntaxKind.Text, text: "B", pos: 10 },
        ]);
    });
    it("Should handle a comment with stars missing a space", () => {
        const tokens = lex(dedent(`
            /*
             * A
             *B
             */
            `));
        (0, assert_1.deepStrictEqual)(tokens, [
            { kind: lexer_1.TokenSyntaxKind.Text, text: "A", pos: 6 },
            { kind: lexer_1.TokenSyntaxKind.NewLine, text: "\n", pos: 7 },
            { kind: lexer_1.TokenSyntaxKind.Text, text: "B", pos: 10 },
        ]);
    });
    it("Should handle braces", () => {
        const tokens = lex("/* {} */");
        (0, assert_1.deepStrictEqual)(tokens, [
            { kind: lexer_1.TokenSyntaxKind.OpenBrace, text: "{", pos: 3 },
            { kind: lexer_1.TokenSyntaxKind.CloseBrace, text: "}", pos: 4 },
        ]);
    });
    it("Should handle escaping braces", () => {
        const tokens = lex("/* \\{\\} */");
        (0, assert_1.deepStrictEqual)(tokens, [{ kind: lexer_1.TokenSyntaxKind.Text, text: "{}", pos: 3 }]);
    });
    it("Should allow escaping slashes", () => {
        const tokens = lex("/* Text *\\/ */");
        (0, assert_1.deepStrictEqual)(tokens, [
            { kind: lexer_1.TokenSyntaxKind.Text, text: "Text */", pos: 3 },
        ]);
    });
    it("Should allow escaping slashes in code blocks", () => {
        const tokens = lex(dedent(`
            /**
             * \`\`\`ts
             * /* inner block comment *\\/
             * \`\`\`
             */
            `));
        (0, assert_1.deepStrictEqual)(tokens, [
            {
                kind: lexer_1.TokenSyntaxKind.Code,
                text: "```ts\n/* inner block comment */\n```",
                pos: 7,
            },
        ]);
    });
    it("Should pass through unknown escapes", () => {
        const tokens = lex("/* \\\\ \\n */");
        (0, assert_1.deepStrictEqual)(tokens, [
            { kind: lexer_1.TokenSyntaxKind.Text, text: "\\\\ \\n", pos: 3 },
        ]);
    });
    it("Should recognize tags", () => {
        const tokens = lex("/* @tag @a @abc234 */");
        (0, assert_1.deepStrictEqual)(tokens, [
            { kind: lexer_1.TokenSyntaxKind.Tag, text: "@tag", pos: 3 },
            { kind: lexer_1.TokenSyntaxKind.Text, text: " ", pos: 7 },
            { kind: lexer_1.TokenSyntaxKind.Tag, text: "@a", pos: 8 },
            { kind: lexer_1.TokenSyntaxKind.Text, text: " ", pos: 10 },
            { kind: lexer_1.TokenSyntaxKind.Tag, text: "@abc234", pos: 11 },
        ]);
    });
    it("Should not indiscriminately create tags", () => {
        const tokens = lex("/* @123 @@ @ */");
        (0, assert_1.deepStrictEqual)(tokens, [
            { kind: lexer_1.TokenSyntaxKind.Text, text: "@123 @@ @", pos: 3 },
        ]);
    });
    it("Should allow escaping @ to prevent a tag creation", () => {
        const tokens = lex("/* not a \\@tag */");
        (0, assert_1.deepStrictEqual)(tokens, [
            { kind: lexer_1.TokenSyntaxKind.Text, text: "not a @tag", pos: 3 },
        ]);
    });
    it("Should not mistake an email for a modifier tag", () => {
        const tokens = lex("/* test@example.com */");
        (0, assert_1.deepStrictEqual)(tokens, [
            { kind: lexer_1.TokenSyntaxKind.Text, text: "test@example.com", pos: 3 },
        ]);
    });
    it("Should not mistake a scoped package for a tag", () => {
        const tokens = lex("/* @typescript-eslint/parser @jest/globals */");
        (0, assert_1.deepStrictEqual)(tokens, [
            {
                kind: lexer_1.TokenSyntaxKind.Text,
                text: "@typescript-eslint/parser @jest/globals",
                pos: 3,
            },
        ]);
    });
    it("Should allow escaping @ in an email", () => {
        const tokens = lex("/* test\\@example.com */");
        (0, assert_1.deepStrictEqual)(tokens, [
            { kind: lexer_1.TokenSyntaxKind.Text, text: "test@example.com", pos: 3 },
        ]);
    });
    it("Should allow inline code", () => {
        const tokens = lex("/* test `code` after */");
        (0, assert_1.deepStrictEqual)(tokens, [
            { kind: lexer_1.TokenSyntaxKind.Text, text: "test ", pos: 3 },
            { kind: lexer_1.TokenSyntaxKind.Code, text: "`code`", pos: 8 },
            { kind: lexer_1.TokenSyntaxKind.Text, text: " after", pos: 14 },
        ]);
    });
    it("Should allow inline code with multiple ticks", () => {
        const tokens = lex("/* test ```not ```` closed``` after */");
        (0, assert_1.deepStrictEqual)(tokens, [
            { kind: lexer_1.TokenSyntaxKind.Text, text: "test ", pos: 3 },
            {
                kind: lexer_1.TokenSyntaxKind.Code,
                text: "```not ```` closed```",
                pos: 8,
            },
            { kind: lexer_1.TokenSyntaxKind.Text, text: " after", pos: 29 },
        ]);
    });
    it("Should allow escaping ticks", () => {
        const tokens = lex("/* test `\\`` after */");
        (0, assert_1.deepStrictEqual)(tokens, [
            { kind: lexer_1.TokenSyntaxKind.Text, text: "test ", pos: 3 },
            { kind: lexer_1.TokenSyntaxKind.Code, text: "`\\``", pos: 8 },
            { kind: lexer_1.TokenSyntaxKind.Text, text: " after", pos: 12 },
        ]);
    });
    it("Should handle stars within code", () => {
        const tokens = lex(dedent(`
            /**
             * \`\`\`ts
             *   test()
             * \`\`\`
             */`));
        (0, assert_1.deepStrictEqual)(tokens, [
            {
                kind: lexer_1.TokenSyntaxKind.Code,
                text: "```ts\n  test()\n```",
                pos: 7,
            },
        ]);
    });
    it("Should indent code without stars", () => {
        const tokens = lex(dedent(`
            /**
            \`\`\`ts
              test()
            \`\`\`
            */`));
        (0, assert_1.deepStrictEqual)(tokens, [
            {
                kind: lexer_1.TokenSyntaxKind.Code,
                text: "```ts\n  test()\n```",
                pos: 4,
            },
        ]);
    });
    it("Should treat unclosed inline code as text", () => {
        const tokens = lex("/* text ` still text */");
        (0, assert_1.deepStrictEqual)(tokens, [
            { kind: lexer_1.TokenSyntaxKind.Text, text: "text ` still text", pos: 3 },
        ]);
    });
    it("Should treat unclosed code blocks as code", () => {
        const tokens = lex(dedent(`
                /*
                 * Text
                 * \`\`\`ts
                 * foo();
                 */`));
        (0, assert_1.deepStrictEqual)(tokens, [
            { kind: lexer_1.TokenSyntaxKind.Text, text: "Text", pos: 6 },
            { kind: lexer_1.TokenSyntaxKind.NewLine, text: "\n", pos: 10 },
            { kind: lexer_1.TokenSyntaxKind.Code, text: "```ts\nfoo();", pos: 14 },
        ]);
    });
    it("Should handle tags after unclosed code", () => {
        const tokens = lex(dedent(`
                /*
                 * Text
                 * code? \`\` fake
                 * @blockTag text
                 */`));
        (0, assert_1.deepStrictEqual)(tokens, [
            { kind: lexer_1.TokenSyntaxKind.Text, text: "Text", pos: 6 },
            { kind: lexer_1.TokenSyntaxKind.NewLine, text: "\n", pos: 10 },
            { kind: lexer_1.TokenSyntaxKind.Text, text: "code? `` fake", pos: 14 },
            { kind: lexer_1.TokenSyntaxKind.NewLine, text: "\n", pos: 27 },
            { kind: lexer_1.TokenSyntaxKind.Tag, text: "@blockTag", pos: 31 },
            { kind: lexer_1.TokenSyntaxKind.Text, text: " text", pos: 40 },
        ]);
    });
    it("Should handle text on the first line of a comment", () => {
        let tokens = lex(dedent(`
                /* Text
                 * Text2
                 */`));
        (0, assert_1.deepStrictEqual)(tokens, [
            { kind: lexer_1.TokenSyntaxKind.Text, text: "Text", pos: 3 },
            { kind: lexer_1.TokenSyntaxKind.NewLine, text: "\n", pos: 7 },
            { kind: lexer_1.TokenSyntaxKind.Text, text: "Text2", pos: 11 },
        ]);
        tokens = lex(dedent(`
                /** Text
                 * Text2
                 */`));
        (0, assert_1.deepStrictEqual)(tokens, [
            { kind: lexer_1.TokenSyntaxKind.Text, text: "Text", pos: 4 },
            { kind: lexer_1.TokenSyntaxKind.NewLine, text: "\n", pos: 8 },
            { kind: lexer_1.TokenSyntaxKind.Text, text: "Text2", pos: 12 },
        ]);
    });
    it("Should handle a full comment", () => {
        const tokens = lex(dedent(`
            /**
             * This is a summary.
             *
             * @remarks
             * Detailed text here with a {@link Inline | inline link}
             *
             * @alpha @beta
             */`));
        (0, assert_1.deepStrictEqual)(tokens, [
            { kind: lexer_1.TokenSyntaxKind.Text, text: "This is a summary.", pos: 7 },
            { kind: lexer_1.TokenSyntaxKind.NewLine, text: "\n", pos: 25 },
            { kind: lexer_1.TokenSyntaxKind.NewLine, text: "\n", pos: 28 },
            { kind: lexer_1.TokenSyntaxKind.Tag, text: "@remarks", pos: 32 },
            { kind: lexer_1.TokenSyntaxKind.NewLine, text: "\n", pos: 40 },
            {
                kind: lexer_1.TokenSyntaxKind.Text,
                text: "Detailed text here with a ",
                pos: 44,
            },
            { kind: lexer_1.TokenSyntaxKind.OpenBrace, text: "{", pos: 70 },
            { kind: lexer_1.TokenSyntaxKind.Tag, text: "@link", pos: 71 },
            {
                kind: lexer_1.TokenSyntaxKind.Text,
                text: " Inline | inline link",
                pos: 76,
            },
            { kind: lexer_1.TokenSyntaxKind.CloseBrace, text: "}", pos: 97 },
            { kind: lexer_1.TokenSyntaxKind.NewLine, text: "\n", pos: 98 },
            { kind: lexer_1.TokenSyntaxKind.NewLine, text: "\n", pos: 101 },
            { kind: lexer_1.TokenSyntaxKind.Tag, text: "@alpha", pos: 105 },
            { kind: lexer_1.TokenSyntaxKind.Text, text: " ", pos: 111 },
            { kind: lexer_1.TokenSyntaxKind.Tag, text: "@beta", pos: 112 },
        ]);
    });
    it("Should handle starred comments without an end tag in code", () => {
        const tokens = lex(dedent(`
            /**
             *Text
             *\`\`\`
             *Text
             */`));
        (0, assert_1.deepStrictEqual)(tokens, [
            { kind: lexer_1.TokenSyntaxKind.Text, text: "Text", pos: 6 },
            { kind: lexer_1.TokenSyntaxKind.NewLine, text: "\n", pos: 10 },
            { kind: lexer_1.TokenSyntaxKind.Code, text: "```\nText", pos: 13 },
        ]);
    });
    it("Should handle type annotations after tags at the start of a line", () => {
        const tokens = lex(dedent(`
            /**
             * @param {string} foo
             */`));
        (0, assert_1.deepStrictEqual)(tokens, [
            { kind: lexer_1.TokenSyntaxKind.Tag, text: "@param", pos: 7 },
            { kind: lexer_1.TokenSyntaxKind.Text, text: " ", pos: 13 },
            { kind: lexer_1.TokenSyntaxKind.TypeAnnotation, text: "{string}", pos: 14 },
            { kind: lexer_1.TokenSyntaxKind.Text, text: " foo", pos: 22 },
        ]);
    });
    it("Should handle type annotations containing string literals", () => {
        const tokens = lex(dedent(`
            /**
             * @param {"{{}}"}
             * @param {\`\${"{}"}\`}
             * @param {"text\\"more {}"}
             * @param {'{'}
             * EOF
             */`));
        const expectedAnnotations = [
            '{"{{}}"}',
            '{`${"{}"}`}',
            '{"text\\"more {}"}',
            "{'{'}",
        ];
        const expectedTokens = expectedAnnotations.flatMap((text) => [
            { kind: lexer_1.TokenSyntaxKind.Tag, text: "@param" },
            { kind: lexer_1.TokenSyntaxKind.Text, text: " " },
            { kind: lexer_1.TokenSyntaxKind.TypeAnnotation, text },
            { kind: lexer_1.TokenSyntaxKind.NewLine, text: "\n" },
        ]);
        expectedTokens.push({ kind: lexer_1.TokenSyntaxKind.Text, text: "EOF" });
        (0, assert_1.deepStrictEqual)(tokens.map((tok) => ({ kind: tok.kind, text: tok.text })), expectedTokens);
    });
    it("Should handle type annotations with object literals", () => {
        const tokens = lex(dedent(`
            /**
             * @param {{ a: string }}
             * @param {{ a: string; b: { c: { d: string }} }}
             * EOF
             */`));
        const expectedAnnotations = [
            "{{ a: string }}",
            "{{ a: string; b: { c: { d: string }} }}",
        ];
        const expectedTokens = expectedAnnotations.flatMap((text) => [
            { kind: lexer_1.TokenSyntaxKind.Tag, text: "@param" },
            { kind: lexer_1.TokenSyntaxKind.Text, text: " " },
            { kind: lexer_1.TokenSyntaxKind.TypeAnnotation, text },
            { kind: lexer_1.TokenSyntaxKind.NewLine, text: "\n" },
        ]);
        expectedTokens.push({ kind: lexer_1.TokenSyntaxKind.Text, text: "EOF" });
        (0, assert_1.deepStrictEqual)(tokens.map((tok) => ({ kind: tok.kind, text: tok.text })), expectedTokens);
    });
    it("Should handle unclosed type annotations", () => {
        const tokens = lex("/** @type {oops */");
        (0, assert_1.deepStrictEqual)(tokens, [
            { kind: lexer_1.TokenSyntaxKind.Tag, text: "@type", pos: 4 },
            { kind: lexer_1.TokenSyntaxKind.Text, text: " ", pos: 9 },
            { kind: lexer_1.TokenSyntaxKind.TypeAnnotation, text: "{oops", pos: 10 },
        ]);
    });
    it("Should not parse inline tags as types", () => {
        const tokens = lex("/** @param {@link foo} */");
        (0, assert_1.deepStrictEqual)(tokens, [
            { kind: lexer_1.TokenSyntaxKind.Tag, text: "@param", pos: 4 },
            { kind: lexer_1.TokenSyntaxKind.Text, text: " ", pos: 10 },
            { kind: lexer_1.TokenSyntaxKind.OpenBrace, text: "{", pos: 11 },
            { kind: lexer_1.TokenSyntaxKind.Tag, text: "@link", pos: 12 },
            { kind: lexer_1.TokenSyntaxKind.Text, text: " foo", pos: 17 },
            { kind: lexer_1.TokenSyntaxKind.CloseBrace, text: "}", pos: 21 },
        ]);
    });
    it("Should allow inline tags directly next to braces", () => {
        const tokens = lex("/** {@inline} */");
        (0, assert_1.deepStrictEqual)(tokens, [
            { kind: lexer_1.TokenSyntaxKind.OpenBrace, text: "{", pos: 4 },
            { kind: lexer_1.TokenSyntaxKind.Tag, text: "@inline", pos: 5 },
            { kind: lexer_1.TokenSyntaxKind.CloseBrace, text: "}", pos: 12 },
        ]);
    });
});
describe("Line Comment Lexer", () => {
    function lex(text) {
        return Array.from((0, lineLexer_1.lexLineComments)(text, [
            {
                kind: typescript_1.default.SyntaxKind.SingleLineCommentTrivia,
                pos: 0,
                end: text.length,
            },
        ]));
    }
    it("Should handle an empty string", () => {
        (0, assert_1.deepStrictEqual)(lex("//"), []);
        (0, assert_1.deepStrictEqual)(lex("//   "), []);
    });
    it("Should handle a trivial comment", () => {
        const tokens = lex("// Comment ");
        (0, assert_1.deepStrictEqual)(tokens, [
            { kind: lexer_1.TokenSyntaxKind.Text, text: "Comment", pos: 3 },
        ]);
    });
    it("Should handle a multiline comment", () => {
        const tokens = lex("// Comment\n  // Next line ");
        (0, assert_1.deepStrictEqual)(tokens, [
            { kind: lexer_1.TokenSyntaxKind.Text, text: "Comment", pos: 3 },
            { kind: lexer_1.TokenSyntaxKind.NewLine, text: "\n", pos: 10 },
            { kind: lexer_1.TokenSyntaxKind.Text, text: "Next line", pos: 16 },
        ]);
    });
    it("Should handle braces", () => {
        const tokens = lex("// {}");
        (0, assert_1.deepStrictEqual)(tokens, [
            { kind: lexer_1.TokenSyntaxKind.OpenBrace, text: "{", pos: 3 },
            { kind: lexer_1.TokenSyntaxKind.CloseBrace, text: "}", pos: 4 },
        ]);
    });
    it("Should handle escaping braces", () => {
        const tokens = lex("// \\{\\}");
        (0, assert_1.deepStrictEqual)(tokens, [{ kind: lexer_1.TokenSyntaxKind.Text, text: "{}", pos: 3 }]);
    });
    it("Should pass through unknown escapes", () => {
        const tokens = lex("// \\\\ \\n");
        (0, assert_1.deepStrictEqual)(tokens, [
            { kind: lexer_1.TokenSyntaxKind.Text, text: "\\\\ \\n", pos: 3 },
        ]);
        (0, assert_1.deepStrictEqual)(lex("// *\\/"), [
            { kind: lexer_1.TokenSyntaxKind.Text, text: "*\\/", pos: 3 },
        ]);
    });
    it("Should recognize tags", () => {
        const tokens = lex("// @tag @a @abc234");
        (0, assert_1.deepStrictEqual)(tokens, [
            { kind: lexer_1.TokenSyntaxKind.Tag, text: "@tag", pos: 3 },
            { kind: lexer_1.TokenSyntaxKind.Text, text: " ", pos: 7 },
            { kind: lexer_1.TokenSyntaxKind.Tag, text: "@a", pos: 8 },
            { kind: lexer_1.TokenSyntaxKind.Text, text: " ", pos: 10 },
            { kind: lexer_1.TokenSyntaxKind.Tag, text: "@abc234", pos: 11 },
        ]);
    });
    it("Should not indiscriminately create tags", () => {
        const tokens = lex("// @123 @@ @");
        (0, assert_1.deepStrictEqual)(tokens, [
            { kind: lexer_1.TokenSyntaxKind.Text, text: "@123 @@ @", pos: 3 },
        ]);
    });
    it("Should allow escaping @ to prevent a tag creation", () => {
        const tokens = lex("// not a \\@tag");
        (0, assert_1.deepStrictEqual)(tokens, [
            { kind: lexer_1.TokenSyntaxKind.Text, text: "not a @tag", pos: 3 },
        ]);
    });
    it("Should not mistake an email for a modifier tag", () => {
        const tokens = lex("// test@example.com");
        (0, assert_1.deepStrictEqual)(tokens, [
            { kind: lexer_1.TokenSyntaxKind.Text, text: "test@example.com", pos: 3 },
        ]);
    });
    it("Should not mistake a scoped package for a tag", () => {
        const tokens = lex("// @typescript-eslint/parser @jest/globals");
        (0, assert_1.deepStrictEqual)(tokens, [
            {
                kind: lexer_1.TokenSyntaxKind.Text,
                text: "@typescript-eslint/parser @jest/globals",
                pos: 3,
            },
        ]);
    });
    it("Should allow escaping @ in an email", () => {
        const tokens = lex("// test\\@example.com");
        (0, assert_1.deepStrictEqual)(tokens, [
            { kind: lexer_1.TokenSyntaxKind.Text, text: "test@example.com", pos: 3 },
        ]);
    });
    it("Should allow inline code", () => {
        const tokens = lex("// test `code` after");
        (0, assert_1.deepStrictEqual)(tokens, [
            { kind: lexer_1.TokenSyntaxKind.Text, text: "test ", pos: 3 },
            { kind: lexer_1.TokenSyntaxKind.Code, text: "`code`", pos: 8 },
            { kind: lexer_1.TokenSyntaxKind.Text, text: " after", pos: 14 },
        ]);
    });
    it("Should allow inline code with multiple ticks", () => {
        const tokens = lex("// test ```not ```` closed``` after");
        (0, assert_1.deepStrictEqual)(tokens, [
            { kind: lexer_1.TokenSyntaxKind.Text, text: "test ", pos: 3 },
            {
                kind: lexer_1.TokenSyntaxKind.Code,
                text: "```not ```` closed```",
                pos: 8,
            },
            { kind: lexer_1.TokenSyntaxKind.Text, text: " after", pos: 29 },
        ]);
    });
    it("Should allow escaping ticks", () => {
        const tokens = lex("// test `\\`` after");
        (0, assert_1.deepStrictEqual)(tokens, [
            { kind: lexer_1.TokenSyntaxKind.Text, text: "test ", pos: 3 },
            { kind: lexer_1.TokenSyntaxKind.Code, text: "`\\``", pos: 8 },
            { kind: lexer_1.TokenSyntaxKind.Text, text: " after", pos: 12 },
        ]);
    });
    it("Should treat unclosed inline code as text", () => {
        const tokens = lex("// text ` still text");
        (0, assert_1.deepStrictEqual)(tokens, [
            { kind: lexer_1.TokenSyntaxKind.Text, text: "text ` still text", pos: 3 },
        ]);
    });
    it("Should handle tags after unclosed code", () => {
        const tokens = lex(dedent(`
            // Text
            // code? \`\` fake
            // @blockTag text
        `));
        (0, assert_1.deepStrictEqual)(tokens, [
            { kind: lexer_1.TokenSyntaxKind.Text, text: "Text", pos: 3 },
            { kind: lexer_1.TokenSyntaxKind.NewLine, text: "\n", pos: 7 },
            { kind: lexer_1.TokenSyntaxKind.Text, text: "code? `` fake", pos: 11 },
            { kind: lexer_1.TokenSyntaxKind.NewLine, text: "\n", pos: 24 },
            { kind: lexer_1.TokenSyntaxKind.Tag, text: "@blockTag", pos: 28 },
            { kind: lexer_1.TokenSyntaxKind.Text, text: " text", pos: 37 },
        ]);
    });
    it("Should handle a full comment", () => {
        const tokens = lex(dedent(`
            // This is a summary.
            //
            // @remarks
            // Detailed text here with a {@link Inline | inline link}
            //
            // @alpha @beta
            `));
        (0, assert_1.deepStrictEqual)(tokens.map((tok) => ({ kind: tok.kind, text: tok.text })), [
            { kind: lexer_1.TokenSyntaxKind.Text, text: "This is a summary." },
            { kind: lexer_1.TokenSyntaxKind.NewLine, text: "\n" },
            { kind: lexer_1.TokenSyntaxKind.NewLine, text: "\n" },
            { kind: lexer_1.TokenSyntaxKind.Tag, text: "@remarks" },
            { kind: lexer_1.TokenSyntaxKind.NewLine, text: "\n" },
            {
                kind: lexer_1.TokenSyntaxKind.Text,
                text: "Detailed text here with a ",
            },
            { kind: lexer_1.TokenSyntaxKind.OpenBrace, text: "{" },
            { kind: lexer_1.TokenSyntaxKind.Tag, text: "@link" },
            { kind: lexer_1.TokenSyntaxKind.Text, text: " Inline | inline link" },
            { kind: lexer_1.TokenSyntaxKind.CloseBrace, text: "}" },
            { kind: lexer_1.TokenSyntaxKind.NewLine, text: "\n" },
            { kind: lexer_1.TokenSyntaxKind.NewLine, text: "\n" },
            { kind: lexer_1.TokenSyntaxKind.Tag, text: "@alpha" },
            { kind: lexer_1.TokenSyntaxKind.Text, text: " " },
            { kind: lexer_1.TokenSyntaxKind.Tag, text: "@beta" },
        ]);
    });
    it("Should handle unclosed code blocks", () => {
        const tokens = lex(dedent(`
            // Text
            // \`\`\`
            // Text`));
        (0, assert_1.deepStrictEqual)(tokens, [
            { kind: lexer_1.TokenSyntaxKind.Text, text: "Text", pos: 3 },
            { kind: lexer_1.TokenSyntaxKind.NewLine, text: "\n", pos: 7 },
            { kind: lexer_1.TokenSyntaxKind.Code, text: "```\nText", pos: 11 },
        ]);
    });
    it("Should handle type annotations after tags at the start of a line", () => {
        const tokens = lex(`// @param {string} foo`);
        (0, assert_1.deepStrictEqual)(tokens, [
            { kind: lexer_1.TokenSyntaxKind.Tag, text: "@param", pos: 3 },
            { kind: lexer_1.TokenSyntaxKind.Text, text: " ", pos: 9 },
            { kind: lexer_1.TokenSyntaxKind.TypeAnnotation, text: "{string}", pos: 10 },
            { kind: lexer_1.TokenSyntaxKind.Text, text: " foo", pos: 18 },
        ]);
    });
    it("Should handle type annotations containing string literals", () => {
        const tokens = lex(dedent(`
            // @param {"{{}}"}
            // @param {\`\${"{}"}\`}
            // @param {"text\\"more {}"}
            // @param {'{'}
            // EOF
            `));
        const expectedAnnotations = [
            '{"{{}}"}',
            '{`${"{}"}`}',
            '{"text\\"more {}"}',
            "{'{'}",
        ];
        const expectedTokens = expectedAnnotations.flatMap((text) => [
            { kind: lexer_1.TokenSyntaxKind.Tag, text: "@param" },
            { kind: lexer_1.TokenSyntaxKind.Text, text: " " },
            { kind: lexer_1.TokenSyntaxKind.TypeAnnotation, text },
            { kind: lexer_1.TokenSyntaxKind.NewLine, text: "\n" },
        ]);
        expectedTokens.push({ kind: lexer_1.TokenSyntaxKind.Text, text: "EOF" });
        (0, assert_1.deepStrictEqual)(tokens.map((tok) => ({ kind: tok.kind, text: tok.text })), expectedTokens);
    });
    it("Should handle type annotations with object literals", () => {
        const tokens = lex(dedent(`
            // @param {{ a: string }}
            // @param {{ a: string; b: { c: { d: string }} }}
            // EOF
            `));
        const expectedAnnotations = [
            "{{ a: string }}",
            "{{ a: string; b: { c: { d: string }} }}",
        ];
        const expectedTokens = expectedAnnotations.flatMap((text) => [
            { kind: lexer_1.TokenSyntaxKind.Tag, text: "@param" },
            { kind: lexer_1.TokenSyntaxKind.Text, text: " " },
            { kind: lexer_1.TokenSyntaxKind.TypeAnnotation, text },
            { kind: lexer_1.TokenSyntaxKind.NewLine, text: "\n" },
        ]);
        expectedTokens.push({ kind: lexer_1.TokenSyntaxKind.Text, text: "EOF" });
        (0, assert_1.deepStrictEqual)(tokens.map((tok) => ({ kind: tok.kind, text: tok.text })), expectedTokens);
    });
    it("Should handle unclosed type annotations", () => {
        const tokens = lex("// @type {oops");
        (0, assert_1.deepStrictEqual)(tokens, [
            { kind: lexer_1.TokenSyntaxKind.Tag, text: "@type", pos: 3 },
            { kind: lexer_1.TokenSyntaxKind.Text, text: " ", pos: 8 },
            { kind: lexer_1.TokenSyntaxKind.TypeAnnotation, text: "{oops", pos: 9 },
        ]);
    });
    it("Should not parse inline tags as types", () => {
        const tokens = lex("// @param { @link foo}");
        (0, assert_1.deepStrictEqual)(tokens, [
            { kind: lexer_1.TokenSyntaxKind.Tag, text: "@param", pos: 3 },
            { kind: lexer_1.TokenSyntaxKind.Text, text: " ", pos: 9 },
            { kind: lexer_1.TokenSyntaxKind.OpenBrace, text: "{", pos: 10 },
            { kind: lexer_1.TokenSyntaxKind.Text, text: " ", pos: 11 },
            { kind: lexer_1.TokenSyntaxKind.Tag, text: "@link", pos: 12 },
            { kind: lexer_1.TokenSyntaxKind.Text, text: " foo", pos: 17 },
            { kind: lexer_1.TokenSyntaxKind.CloseBrace, text: "}", pos: 21 },
        ]);
    });
    it("Should allow inline tags directly next to braces", () => {
        const tokens = lex("// {@inline}");
        (0, assert_1.deepStrictEqual)(tokens, [
            { kind: lexer_1.TokenSyntaxKind.OpenBrace, text: "{", pos: 3 },
            { kind: lexer_1.TokenSyntaxKind.Tag, text: "@inline", pos: 4 },
            { kind: lexer_1.TokenSyntaxKind.CloseBrace, text: "}", pos: 11 },
        ]);
    });
});
describe("Raw Lexer", () => {
    function lex(text) {
        return Array.from((0, rawLexer_1.lexCommentString)(text));
    }
    it("Should handle an empty string", () => {
        (0, assert_1.deepStrictEqual)(lex(""), []);
        (0, assert_1.deepStrictEqual)(lex("   \n   "), []);
    });
    it("Should handle a trivial comment", () => {
        const tokens = lex(" Comment ");
        (0, assert_1.deepStrictEqual)(tokens, [
            { kind: lexer_1.TokenSyntaxKind.Text, text: "Comment", pos: 1 },
        ]);
    });
    it("Should handle a multiline comment", () => {
        const tokens = lex(" Comment\nNext line ");
        (0, assert_1.deepStrictEqual)(tokens, [
            { kind: lexer_1.TokenSyntaxKind.Text, text: "Comment\nNext line", pos: 1 },
        ]);
    });
    it("Should handle braces", () => {
        const tokens = lex("{}");
        (0, assert_1.deepStrictEqual)(tokens, [
            { kind: lexer_1.TokenSyntaxKind.OpenBrace, text: "{", pos: 0 },
            { kind: lexer_1.TokenSyntaxKind.CloseBrace, text: "}", pos: 1 },
        ]);
    });
    it("Should handle escaping braces", () => {
        const tokens = lex("\\{\\}");
        (0, assert_1.deepStrictEqual)(tokens, [{ kind: lexer_1.TokenSyntaxKind.Text, text: "{}", pos: 0 }]);
    });
    it("Should pass through unknown escapes", () => {
        const tokens = lex("\\\\ \\n");
        (0, assert_1.deepStrictEqual)(tokens, [
            { kind: lexer_1.TokenSyntaxKind.Text, text: "\\\\ \\n", pos: 0 },
        ]);
        (0, assert_1.deepStrictEqual)(lex("*\\/"), [
            { kind: lexer_1.TokenSyntaxKind.Text, text: "*\\/", pos: 0 },
        ]);
    });
    it("Should not recognize tags", () => {
        const tokens = lex("@123 @@ @ @tag @a @abc234");
        (0, assert_1.deepStrictEqual)(tokens, [
            {
                kind: lexer_1.TokenSyntaxKind.Text,
                text: "@123 @@ @ @tag @a @abc234",
                pos: 0,
            },
        ]);
    });
    it("Should allow escaping @ to prevent a tag creation", () => {
        const tokens = lex("not a \\@tag");
        (0, assert_1.deepStrictEqual)(tokens, [
            { kind: lexer_1.TokenSyntaxKind.Text, text: "not a @tag", pos: 0 },
        ]);
    });
    it("Should allow inline code", () => {
        const tokens = lex("test `code` after");
        (0, assert_1.deepStrictEqual)(tokens, [
            { kind: lexer_1.TokenSyntaxKind.Text, text: "test ", pos: 0 },
            { kind: lexer_1.TokenSyntaxKind.Code, text: "`code`", pos: 5 },
            { kind: lexer_1.TokenSyntaxKind.Text, text: " after", pos: 11 },
        ]);
    });
    // https://github.com/TypeStrong/typedoc/issues/1922#issuecomment-1166278275
    it("Should handle code blocks ending a string", () => {
        const tokens = lex("`code`");
        (0, assert_1.deepStrictEqual)(tokens, [
            {
                kind: "code",
                text: "`code`",
                pos: 0,
            },
        ]);
    });
    it("Should allow inline code with multiple ticks", () => {
        const tokens = lex("test ```not ```` closed``` after");
        (0, assert_1.deepStrictEqual)(tokens, [
            { kind: lexer_1.TokenSyntaxKind.Text, text: "test ", pos: 0 },
            {
                kind: lexer_1.TokenSyntaxKind.Code,
                text: "```not ```` closed```",
                pos: 5,
            },
            { kind: lexer_1.TokenSyntaxKind.Text, text: " after", pos: 26 },
        ]);
    });
    it("Should allow escaping ticks", () => {
        const tokens = lex("test `\\`` after");
        (0, assert_1.deepStrictEqual)(tokens, [
            { kind: lexer_1.TokenSyntaxKind.Text, text: "test ", pos: 0 },
            { kind: lexer_1.TokenSyntaxKind.Code, text: "`\\``", pos: 5 },
            { kind: lexer_1.TokenSyntaxKind.Text, text: " after", pos: 9 },
        ]);
    });
    it("Should treat unclosed inline code as text", () => {
        const tokens = lex("text ` still text");
        (0, assert_1.deepStrictEqual)(tokens, [
            { kind: lexer_1.TokenSyntaxKind.Text, text: "text ` still text", pos: 0 },
        ]);
    });
    it("Should handle unclosed code blocks", () => {
        const tokens = lex(dedent(`
            Text
            \`\`\`
            Text`));
        (0, assert_1.deepStrictEqual)(tokens, [
            { kind: lexer_1.TokenSyntaxKind.Text, text: "Text\n", pos: 0 },
            { kind: lexer_1.TokenSyntaxKind.Code, text: "```\nText", pos: 5 },
        ]);
    });
    it("Should allow inline tags directly next to braces", () => {
        const tokens = lex("{@inline}");
        (0, assert_1.deepStrictEqual)(tokens, [
            { kind: lexer_1.TokenSyntaxKind.OpenBrace, text: "{", pos: 0 },
            { kind: lexer_1.TokenSyntaxKind.Tag, text: "@inline", pos: 1 },
            { kind: lexer_1.TokenSyntaxKind.CloseBrace, text: "}", pos: 8 },
        ]);
    });
    it("Should allow inline tags with spaces surrounding the braces", () => {
        const tokens = lex("{ @link https://example.com example }");
        (0, assert_1.deepStrictEqual)(tokens, [
            { kind: lexer_1.TokenSyntaxKind.OpenBrace, text: "{", pos: 0 },
            { kind: lexer_1.TokenSyntaxKind.Text, text: " ", pos: 1 },
            { kind: lexer_1.TokenSyntaxKind.Tag, text: "@link", pos: 2 },
            {
                kind: lexer_1.TokenSyntaxKind.Text,
                text: " https://example.com example ",
                pos: 7,
            },
            { kind: lexer_1.TokenSyntaxKind.CloseBrace, text: "}", pos: 36 },
        ]);
    });
});
describe("Comment Parser", () => {
    const config = {
        blockTags: new Set([
            "@param",
            "@remarks",
            "@module",
            "@inheritDoc",
            "@defaultValue",
        ]),
        inlineTags: new Set(["@link"]),
        modifierTags: new Set([
            "@public",
            "@private",
            "@protected",
            "@readonly",
            "@enum",
            "@event",
            "@packageDocumentation",
        ]),
        jsDocCompatibility: {
            defaultTag: true,
            exampleTag: true,
            ignoreUnescapedBraces: false,
            inheritDocTag: false,
        },
        suppressCommentWarningsInDeclarationFiles: false,
        useTsLinkResolution: false,
        commentStyle: "jsdoc",
    };
    it("Should recognize @defaultValue as code", () => {
        const files = new FileRegistry_1.FileRegistry();
        const logger = new TestLogger_1.TestLogger();
        const file = "/** @defaultValue code */";
        const content = (0, blockLexer_1.lexBlockComment)(file);
        const comment = (0, parser_1.parseComment)(content, config, new minimalSourceFile_1.MinimalSourceFile(file, "<memory>"), logger, files);
        (0, assert_1.deepStrictEqual)(comment, new models_1.Comment([], [
            new models_1.CommentTag("@defaultValue", [
                { kind: "code", text: "```ts\ncode\n```" },
            ]),
        ]));
        logger.expectNoOtherMessages();
    });
    it("Should recognize @defaultValue as not code if it contains an inline tag", () => {
        const files = new FileRegistry_1.FileRegistry();
        const logger = new TestLogger_1.TestLogger();
        const file = "/** @defaultValue text {@link foo} */";
        const content = (0, blockLexer_1.lexBlockComment)(file);
        const comment = (0, parser_1.parseComment)(content, config, new minimalSourceFile_1.MinimalSourceFile(file, "<memory>"), logger, files);
        (0, assert_1.deepStrictEqual)(comment, new models_1.Comment([], [
            new models_1.CommentTag("@defaultValue", [
                { kind: "text", text: "text " },
                { kind: "inline-tag", tag: "@link", text: "foo" },
            ]),
        ]));
        logger.expectNoOtherMessages();
    });
    it("Should recognize @defaultValue as not code if it contains code", () => {
        const files = new FileRegistry_1.FileRegistry();
        const logger = new TestLogger_1.TestLogger();
        const file = "/** @defaultValue text `code` */";
        const content = (0, blockLexer_1.lexBlockComment)(file);
        const comment = (0, parser_1.parseComment)(content, config, new minimalSourceFile_1.MinimalSourceFile(file, "<memory>"), logger, files);
        (0, assert_1.deepStrictEqual)(comment, new models_1.Comment([], [
            new models_1.CommentTag("@defaultValue", [
                { kind: "text", text: "text " },
                { kind: "code", text: "`code`" },
            ]),
        ]));
        logger.expectNoOtherMessages();
    });
    it("Should rewrite @inheritdoc to @inheritDoc", () => {
        const files = new FileRegistry_1.FileRegistry();
        const logger = new TestLogger_1.TestLogger();
        const file = "/** @inheritdoc */";
        const content = (0, blockLexer_1.lexBlockComment)(file);
        const comment = (0, parser_1.parseComment)(content, config, new minimalSourceFile_1.MinimalSourceFile(file, "<memory>"), logger, files);
        logger.expectMessage("warn: The @inheritDoc tag should be properly capitalized");
        logger.expectNoOtherMessages();
        (0, assert_1.deepStrictEqual)(comment, new models_1.Comment([], [new models_1.CommentTag("@inheritDoc", [])]));
    });
    let files;
    function getComment(text) {
        files = new FileRegistry_1.FileRegistry();
        const logger = new TestLogger_1.TestLogger();
        const content = (0, blockLexer_1.lexBlockComment)(text);
        const comment = (0, parser_1.parseComment)(content, config, new minimalSourceFile_1.MinimalSourceFile(text, "<memory>"), logger, files);
        logger.expectNoOtherMessages();
        return comment;
    }
    afterEach(() => {
        files = undefined;
    });
    it("Simple summary", () => {
        const comment = getComment("/** Summary! */");
        (0, assert_1.deepStrictEqual)(comment.summary, [{ kind: "text", text: "Summary!" }]);
        (0, assert_1.deepStrictEqual)(comment.blockTags, []);
        (0, assert_1.deepStrictEqual)(comment.modifierTags, new Set());
    });
    it("Summary with remarks", () => {
        const comment = getComment(`/**
            * Summary
            * @remarks Remarks
            */`);
        (0, assert_1.deepStrictEqual)(comment.summary, [{ kind: "text", text: "Summary" }]);
        (0, assert_1.deepStrictEqual)(comment.blockTags, [
            new models_1.CommentTag("@remarks", [{ kind: "text", text: "Remarks" }]),
        ]);
        (0, assert_1.deepStrictEqual)(comment.modifierTags, new Set());
    });
    it("Parameter without content", () => {
        const comment = getComment(`/**
            * Summary
            * @param
            */`);
        (0, assert_1.deepStrictEqual)(comment.summary, [{ kind: "text", text: "Summary" }]);
        const tag = new models_1.CommentTag("@param", []);
        (0, assert_1.deepStrictEqual)(comment.blockTags, [tag]);
        (0, assert_1.deepStrictEqual)(comment.modifierTags, new Set());
    });
    it("Parameter name", () => {
        const comment = getComment(`/**
            * Summary
            * @param T Param text
            */`);
        (0, assert_1.deepStrictEqual)(comment.summary, [{ kind: "text", text: "Summary" }]);
        const tag = new models_1.CommentTag("@param", [
            { kind: "text", text: "Param text" },
        ]);
        tag.name = "T";
        (0, assert_1.deepStrictEqual)(comment.blockTags, [tag]);
        (0, assert_1.deepStrictEqual)(comment.modifierTags, new Set());
    });
    it("Parameter name with no content", () => {
        const comment = getComment(`/**
            * Summary
            * @param T
            */`);
        (0, assert_1.deepStrictEqual)(comment.summary, [{ kind: "text", text: "Summary" }]);
        const tag = new models_1.CommentTag("@param", []);
        tag.name = "T";
        (0, assert_1.deepStrictEqual)(comment.blockTags, [tag]);
        (0, assert_1.deepStrictEqual)(comment.modifierTags, new Set());
    });
    it("Parameter name with dash", () => {
        const comment = getComment(`/**
            * Summary
            * @param T - Param text
            */`);
        (0, assert_1.deepStrictEqual)(comment.summary, [{ kind: "text", text: "Summary" }]);
        const tag = new models_1.CommentTag("@param", [
            { kind: "text", text: "Param text" },
        ]);
        tag.name = "T";
        (0, assert_1.deepStrictEqual)(comment.blockTags, [tag]);
        (0, assert_1.deepStrictEqual)(comment.modifierTags, new Set());
    });
    it("Parameter name with type annotation", () => {
        const comment = getComment(`/**
            * Summary
            * @param {string} T - Param text
            */`);
        (0, assert_1.deepStrictEqual)(comment.summary, [{ kind: "text", text: "Summary" }]);
        const tag = new models_1.CommentTag("@param", [
            { kind: "text", text: "Param text" },
        ]);
        tag.name = "T";
        (0, assert_1.deepStrictEqual)(comment.blockTags, [tag]);
        (0, assert_1.deepStrictEqual)(comment.modifierTags, new Set());
    });
    it("Optional parameter name", () => {
        const comment = getComment(`/**
            * @param {string} [T] Param text
            */`);
        const tag = new models_1.CommentTag("@param", [
            { kind: "text", text: "Param text" },
        ]);
        tag.name = "T";
        (0, assert_1.deepStrictEqual)(comment.blockTags, [tag]);
        (0, assert_1.deepStrictEqual)(comment.modifierTags, new Set());
    });
    it("Optional parameter name with default", () => {
        const comment = getComment(`/**
            * @param {string} [T = 123] Param text
            */`);
        const tag = new models_1.CommentTag("@param", [
            { kind: "text", text: "Param text" },
        ]);
        tag.name = "T";
        (0, assert_1.deepStrictEqual)(comment.blockTags, [tag]);
        (0, assert_1.deepStrictEqual)(comment.modifierTags, new Set());
    });
    it("Optional parameter name with default that contains brackets", () => {
        const comment = getComment(`/**
            * @param {string} [T = [1, ["st[r"]]] Param text
            */`);
        const tag = new models_1.CommentTag("@param", [
            { kind: "text", text: "Param text" },
        ]);
        tag.name = "T";
        (0, assert_1.deepStrictEqual)(comment.blockTags, [tag]);
        (0, assert_1.deepStrictEqual)(comment.modifierTags, new Set());
    });
    it("Recognizes markdown links", () => {
        const comment = getComment(`/**
            * [text](./relative.md) ![](image.png)
            * Not relative: [passwd](/etc/passwd) [Windows](C:\\\\\\\\Windows) [example.com](http://example.com) [hash](#hash)
            */`);
        (0, assert_1.deepStrictEqual)(comment.summary, [
            { kind: "text", text: "[text](" },
            { kind: "relative-link", text: "./relative.md", target: 1 },
            { kind: "text", text: ") ![](" },
            { kind: "relative-link", text: "image.png", target: 2 },
            {
                kind: "text",
                text: ")\nNot relative: [passwd](/etc/passwd) [Windows](C:\\\\\\\\Windows) [example.com](http://example.com) [hash](#hash)",
            },
        ]);
    });
    it("#2606 Recognizes markdown links which contain inline code in the label", () => {
        const comment = getComment(`/**
            * [\`text\`](./relative.md)
            * [\`text\`
            * more](./relative.md)
            * [\`text\`
            *
            * more](./relative.md)
            */`);
        (0, assert_1.deepStrictEqual)(comment.summary, [
            // Simple case with code
            { kind: "text", text: "[" },
            { kind: "code", text: "`text`" },
            { kind: "text", text: "](" },
            { kind: "relative-link", text: "./relative.md", target: 1 },
            // Labels can also include single newlines
            { kind: "text", text: ")\n[" },
            { kind: "code", text: "`text`" },
            { kind: "text", text: "\nmore](" },
            { kind: "relative-link", text: "./relative.md", target: 1 },
            // But not double!
            { kind: "text", text: ")\n[" },
            { kind: "code", text: "`text`" },
            { kind: "text", text: "\n\nmore](./relative.md)" },
        ]);
    });
    it("Recognizes markdown links which contain inline code in the label", () => {
        const comment = getComment(`/**
            * [\`text\`](./relative.md)
            */`);
        (0, assert_1.deepStrictEqual)(comment.summary, [
            { kind: "text", text: "[" },
            { kind: "code", text: "`text`" },
            { kind: "text", text: "](" },
            { kind: "relative-link", text: "./relative.md", target: 1 },
            { kind: "text", text: ")" },
        ]);
    });
    it("Recognizes markdown reference definition blocks", () => {
        const comment = getComment(`/**
            * [1]: ./example.md
            * [2]:<./example with space>
            * [3]: https://example.com
            * [4]: #hash
            */`);
        (0, assert_1.deepStrictEqual)(comment.summary, [
            { kind: "text", text: "[1]: " },
            { kind: "relative-link", text: "./example.md", target: 1 },
            { kind: "text", text: "\n[2]:" },
            {
                kind: "relative-link",
                text: "<./example with space>",
                target: 2,
            },
            {
                kind: "text",
                text: "\n[3]: https://example.com\n[4]: #hash",
            },
        ]);
    });
    it("Does not mistake mailto: links as relative paths", () => {
        const comment = getComment(`/**
            * [1]: mailto:example@example.com
            */`);
        (0, assert_1.deepStrictEqual)(comment.summary, [
            { kind: "text", text: "[1]: mailto:example@example.com" },
        ]);
    });
    it("Recognizes HTML image links", () => {
        const comment = getComment(`/**
        * <img width=100 height="200" src="./test.png" >
        * <img src="./test space.png"/>
        * <img src="https://example.com/favicon.ico">
        */`);
        (0, assert_1.deepStrictEqual)(comment.summary, [
            { kind: "text", text: '<img width=100 height="200" src="' },
            { kind: "relative-link", text: "./test.png", target: 1 },
            { kind: "text", text: '" >\n<img src="' },
            {
                kind: "relative-link",
                text: "./test space.png",
                target: 2,
            },
            {
                kind: "text",
                text: '"/>\n<img src="https://example.com/favicon.ico">',
            },
        ]);
    });
    it("Recognizes HTML anchor links", () => {
        const comment = getComment(`/**
        * <a data-foo="./path.txt" href="./test.png" >
        * <a href="./test space.png"/>
        * <a href="https://example.com/favicon.ico">
        * <a href="#hash">
        */`);
        (0, assert_1.deepStrictEqual)(comment.summary, [
            { kind: "text", text: '<a data-foo="./path.txt" href="' },
            { kind: "relative-link", text: "./test.png", target: 1 },
            { kind: "text", text: '" >\n<a href="' },
            {
                kind: "relative-link",
                text: "./test space.png",
                target: 2,
            },
            {
                kind: "text",
                text: '"/>\n<a href="https://example.com/favicon.ico">\n<a href="#hash">',
            },
        ]);
    });
    it("Properly handles character escapes", () => {
        const comment = getComment(`/**
        * <a href="./&amp;&#97;.png" >
        */`);
        (0, assert_1.deepStrictEqual)(comment.summary, [
            { kind: "text", text: '<a href="' },
            { kind: "relative-link", text: "./&amp;&#97;.png", target: 1 },
            { kind: "text", text: '" >' },
        ]);
        (0, assert_1.deepStrictEqual)(files.getName(1), "&a.png");
        (0, assert_1.deepStrictEqual)(files.getName(1), "&a.png");
    });
});
describe("extractTagName", () => {
    it("Handles simple name", () => {
        (0, assert_1.deepStrictEqual)((0, tagName_1.extractTagName)("T - abc"), { name: "T", newText: "abc" });
        (0, assert_1.deepStrictEqual)((0, tagName_1.extractTagName)("Ta abc"), { name: "Ta", newText: "abc" });
    });
    it("Handles a bracketed name", () => {
        (0, assert_1.deepStrictEqual)((0, tagName_1.extractTagName)("[T] - abc"), { name: "T", newText: "abc" });
        (0, assert_1.deepStrictEqual)((0, tagName_1.extractTagName)("[  Ta ] - abc"), { name: "Ta", newText: "abc" });
        (0, assert_1.deepStrictEqual)((0, tagName_1.extractTagName)("[Tb] abc"), { name: "Tb", newText: "abc" });
    });
    it("Handles a bracketed name with simple defaults", () => {
        (0, assert_1.deepStrictEqual)((0, tagName_1.extractTagName)("[T = 1] - abc"), { name: "T", newText: "abc" });
        (0, assert_1.deepStrictEqual)((0, tagName_1.extractTagName)("[  Ta = 'x'] - abc"), {
            name: "Ta",
            newText: "abc",
        });
    });
    it("Handles a bracketed name with problematic defaults", () => {
        (0, assert_1.deepStrictEqual)((0, tagName_1.extractTagName)("[T = []] - abc"), { name: "T", newText: "abc" });
        (0, assert_1.deepStrictEqual)((0, tagName_1.extractTagName)("[Ta = '['] - abc"), {
            name: "Ta",
            newText: "abc",
        });
    });
    it("Handles an incomplete bracketed name without crashing", () => {
        // Not really ideal, but the comment is badly broken enough here that users
        // should get an error from TS when trying to use it, so this is probably fine.
        (0, assert_1.deepStrictEqual)((0, tagName_1.extractTagName)("[T - abc"), { name: "T", newText: "" });
        (0, assert_1.deepStrictEqual)((0, tagName_1.extractTagName)("[Ta"), { name: "Ta", newText: "" });
    });
});
