"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = require("assert");
const html_1 = require("../../lib/utils/html");
describe("HtmlAttributeParser", () => {
    let State;
    (function (State) {
        State["BeforeAttributeName"] = "BeforeAttributeName";
        State["AfterAttributeName"] = "AfterAttributeName";
        State["BeforeAttributeValue"] = "BeforeAttributeValue";
    })(State || (State = {}));
    function stateStr(state) {
        return {
            [html_1.ParserState.BeforeAttributeName]: State.BeforeAttributeName,
            [html_1.ParserState.AfterAttributeName]: State.AfterAttributeName,
            [html_1.ParserState.BeforeAttributeValue]: State.BeforeAttributeValue,
            [html_1.ParserState.END]: "<END>",
        }[state];
    }
    function parseWithEnd(text) {
        const parser = new html_1.HtmlAttributeParser(text);
        const data = [];
        do {
            parser.step();
            data.push([
                stateStr(parser.state),
                parser.currentAttributeName,
                parser.currentAttributeValue,
            ]);
        } while (parser.state != html_1.ParserState.END);
        return data;
    }
    function parse(text) {
        const data = parseWithEnd(text);
        data.pop();
        return data;
    }
    function parseAttrsToObject(text) {
        const result = {};
        for (const elem of parseWithEnd(text)) {
            result[elem[1]] = elem[2];
        }
        delete result[""];
        return result;
    }
    it("Handles self closing tag", () => {
        (0, assert_1.deepStrictEqual)(parse("  >"), []);
        (0, assert_1.deepStrictEqual)(parse("  />"), []);
    });
    it("Handles EOF before end of tag", () => {
        (0, assert_1.deepStrictEqual)(parse(" \t\f"), []);
    });
    it("Handles names without values", () => {
        (0, assert_1.deepStrictEqual)(parse("a b c />"), [
            [State.AfterAttributeName, "a", ""],
            [State.AfterAttributeName, "b", ""],
            [State.AfterAttributeName, "c", ""],
        ]);
    });
    it("Handles unquoted value", () => {
        (0, assert_1.deepStrictEqual)(parse("a=1 b=bbb />"), [
            [State.BeforeAttributeValue, "a", ""],
            [State.BeforeAttributeName, "a", "1"],
            [State.BeforeAttributeValue, "b", ""],
            [State.BeforeAttributeName, "b", "bbb"],
        ]);
    });
    it("Handles single quoted value", () => {
        (0, assert_1.deepStrictEqual)(parse("a='1' b='b b' />"), [
            [State.BeforeAttributeValue, "a", ""],
            [State.BeforeAttributeName, "a", "1"],
            [State.BeforeAttributeValue, "b", ""],
            [State.BeforeAttributeName, "b", "b b"],
        ]);
    });
    it("Handles double quoted value", () => {
        (0, assert_1.deepStrictEqual)(parse('a="1" b="b b" />'), [
            [State.BeforeAttributeValue, "a", ""],
            [State.BeforeAttributeName, "a", "1"],
            [State.BeforeAttributeValue, "b", ""],
            [State.BeforeAttributeName, "b", "b b"],
        ]);
    });
    it("Handles named escapes", () => {
        (0, assert_1.deepStrictEqual)(parse('a="&amp;" b="&amp" />'), [
            [State.BeforeAttributeValue, "a", ""],
            [State.BeforeAttributeName, "a", "&"],
            [State.BeforeAttributeValue, "b", ""],
            [State.BeforeAttributeName, "b", "&"],
        ]);
    });
    it("Handles invalid named escape", () => {
        (0, assert_1.deepStrictEqual)(parse('a="&ZZBADESCAPE;" />'), [
            [State.BeforeAttributeValue, "a", ""],
            [State.BeforeAttributeName, "a", "&ZZBADESCAPE;"],
        ]);
    });
    it("Handles an attribute without a name", () => {
        (0, assert_1.deepStrictEqual)(parse(" =oops >"), [
            [State.BeforeAttributeValue, "", ""],
            [State.BeforeAttributeName, "", "oops"],
        ]);
    });
    it("Handles invalid characters in attribute names", () => {
        (0, assert_1.deepStrictEqual)(parse(" a\" a' a< >"), [
            [State.AfterAttributeName, 'a"', ""],
            [State.AfterAttributeName, "a'", ""],
            [State.AfterAttributeName, "a<", ""],
        ]);
    });
    it("Handles missing attribute value", () => {
        (0, assert_1.deepStrictEqual)(parse(" a= \t\n\f>"), [[State.BeforeAttributeValue, "a", ""]]);
    });
    it("Handles a null character in a double quoted attribute value", () => {
        (0, assert_1.deepStrictEqual)(parse(' a="\0" >'), [
            [State.BeforeAttributeValue, "a", ""],
            [State.BeforeAttributeName, "a", "\ufffd"],
        ]);
    });
    it("Handles an unterminated double quoted attribute value", () => {
        (0, assert_1.deepStrictEqual)(parse(' a="x'), [[State.BeforeAttributeValue, "a", ""]]);
    });
    it("Handles missing attribute name after an attribute ", () => {
        (0, assert_1.deepStrictEqual)(parse(" a \t\n\f =>"), [
            [State.AfterAttributeName, "a", ""],
            [State.BeforeAttributeValue, "a", ""],
        ]);
    });
    it("Handles named escapes in single quoted value", () => {
        (0, assert_1.deepStrictEqual)(parse("a='&amp;' b='&amp' c='&ampoops' />"), [
            [State.BeforeAttributeValue, "a", ""],
            [State.BeforeAttributeName, "a", "&"],
            [State.BeforeAttributeValue, "b", ""],
            [State.BeforeAttributeName, "b", "&"],
            [State.BeforeAttributeValue, "c", ""],
            [State.BeforeAttributeName, "c", "&ampoops"],
        ]);
    });
    it("Handles a null character in a single quoted attribute value", () => {
        (0, assert_1.deepStrictEqual)(parse(" a='\0' >"), [
            [State.BeforeAttributeValue, "a", ""],
            [State.BeforeAttributeName, "a", "\ufffd"],
        ]);
    });
    it("Handles an unterminated single quoted attribute value", () => {
        (0, assert_1.deepStrictEqual)(parse(" a='x"), [[State.BeforeAttributeValue, "a", ""]]);
    });
    it("Properly terminates unquoted attributes", () => {
        (0, assert_1.deepStrictEqual)(parseAttrsToObject(" a=a\t b=b\n c=c\f"), {
            a: "a",
            b: "b",
            c: "c",
        });
    });
    it("Handles character references in unquoted attributes", () => {
        (0, assert_1.deepStrictEqual)(parseAttrsToObject(" a=&amp;a b=&amp c=&ampoops >"), {
            a: "&a",
            b: "&",
            c: "&ampoops",
        });
    });
    it("Handles more unquoted attribute cases", () => {
        (0, assert_1.deepStrictEqual)(parseAttrsToObject(" a=a>"), {
            a: "a",
        });
        (0, assert_1.deepStrictEqual)(parseAttrsToObject(" a=\0x>"), {
            a: "\ufffdx",
        });
        (0, assert_1.deepStrictEqual)(parseAttrsToObject(" a=a\"'<=`>"), {
            a: "a\"'<=`",
        });
        (0, assert_1.deepStrictEqual)(parseAttrsToObject(" a=a"), {
            a: "a",
        });
    });
    it("Handles characters after a quoted attribute", () => {
        (0, assert_1.deepStrictEqual)(parseAttrsToObject(" a='a'\tb='b'\nc='c'\fd='d'>"), {
            a: "a",
            b: "b",
            c: "c",
            d: "d",
        });
        (0, assert_1.deepStrictEqual)(parseAttrsToObject(" a='a'/"), {
            a: "a",
        });
        (0, assert_1.deepStrictEqual)(parseAttrsToObject(" a='a'"), {
            a: "a",
        });
        (0, assert_1.deepStrictEqual)(parseAttrsToObject(" a='a'b='b' "), {
            a: "a",
            b: "b",
        });
    });
    it("Handles simple numeric character references", () => {
        (0, assert_1.deepStrictEqual)(parseAttrsToObject("a=&#97; b=&#x5A; c=&#X5a;"), {
            a: "a",
            b: "Z",
            c: "Z",
        });
    });
    it("Handles an invalid character reference", () => {
        (0, assert_1.deepStrictEqual)(parseAttrsToObject("a=&&#97;"), {
            a: "&a",
        });
    });
    it("Handles an invalid decimal character reference start", () => {
        (0, assert_1.deepStrictEqual)(parseAttrsToObject("a=&#;"), {
            a: "&#;",
        });
    });
    it("Handles an invalid hex character reference", () => {
        (0, assert_1.deepStrictEqual)(parseAttrsToObject("a=&#x;"), {
            a: "&#x;",
        });
        (0, assert_1.deepStrictEqual)(parseAttrsToObject("a=&#x5A>"), {
            a: "Z",
        });
    });
    it("Handles an ambiguous ampersand without a trailing alphanumeric", () => {
        (0, assert_1.deepStrictEqual)(parseAttrsToObject("a=&a"), {
            a: "&a",
        });
    });
    it("Handles an invalid decimal character reference end", () => {
        (0, assert_1.deepStrictEqual)(parseAttrsToObject("a=&#97>"), {
            a: "a",
        });
    });
    it("Handles invalid characters in numeric character references", () => {
        (0, assert_1.deepStrictEqual)(parseAttrsToObject("a='nul:&#0;x'>"), {
            a: "nul:\ufffdx",
        });
        (0, assert_1.deepStrictEqual)(parseAttrsToObject("a='rng:&#x11ffff;x'>"), {
            a: "rng:\ufffdx",
        });
        (0, assert_1.deepStrictEqual)(parseAttrsToObject("a='leading surrogate:&#xd801;x'>"), {
            a: "leading surrogate:\ufffdx",
        });
        (0, assert_1.deepStrictEqual)(parseAttrsToObject("a='trailing surrogate:&#xdc01;x'>"), {
            a: "trailing surrogate:\ufffdx",
        });
    });
});
