"use strict";
// Tests the `toString` functionality of the type models
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = require("assert");
const models_1 = require("../../lib/models");
const FileRegistry_1 = require("../../lib/models/FileRegistry");
const T = __importStar(require("../../lib/models/types"));
describe("Type.toString", () => {
    describe("Union types", () => {
        it("Does not wrap simple types", () => {
            const type = new T.UnionType([
                new T.LiteralType(1),
                new T.LiteralType(BigInt("1")),
            ]);
            (0, assert_1.strictEqual)(type.toString(), "1 | 1n");
        });
        it("Does not wrap intersection types", () => {
            const type = new T.UnionType([
                new T.IntersectionType([
                    new T.LiteralType(1),
                    new T.LiteralType(2),
                ]),
                new T.LiteralType(3),
            ]);
            (0, assert_1.strictEqual)(type.toString(), "1 & 2 | 3");
        });
        it("Wraps conditional types", () => {
            const type = new T.UnionType([
                new T.ConditionalType(new T.LiteralType(1), new T.LiteralType(2), new T.LiteralType(3), new T.LiteralType(4)),
                new T.LiteralType(5),
            ]);
            (0, assert_1.strictEqual)(type.toString(), "(1 extends 2 ? 3 : 4) | 5");
        });
    });
    describe("Intersection types", () => {
        it("Does not wrap simple types", () => {
            const type = new T.IntersectionType([
                new T.LiteralType(1),
                new T.LiteralType(BigInt("1")),
            ]);
            (0, assert_1.strictEqual)(type.toString(), "1 & 1n");
        });
        it("Wraps union types", () => {
            const type = new T.IntersectionType([
                new T.UnionType([new T.LiteralType(1), new T.LiteralType(2)]),
                new T.LiteralType(3),
            ]);
            (0, assert_1.strictEqual)(type.toString(), "(1 | 2) & 3");
        });
        it("Wraps conditional types", () => {
            const type = new T.IntersectionType([
                new T.ConditionalType(new T.LiteralType(1), new T.LiteralType(2), new T.LiteralType(3), new T.LiteralType(4)),
                new T.LiteralType(5),
            ]);
            (0, assert_1.strictEqual)(type.toString(), "(1 extends 2 ? 3 : 4) & 5");
        });
    });
    describe("Conditional types", () => {
        it("Wraps union types", () => {
            const type = new T.ConditionalType(new T.UnionType([new T.LiteralType(1), new T.LiteralType(2)]), new T.LiteralType("ext"), new T.LiteralType("true"), new T.LiteralType("false"));
            (0, assert_1.strictEqual)(type.toString(), '(1 | 2) extends "ext" ? "true" : "false"');
        });
        it("Wraps intersection types", () => {
            const type = new T.ConditionalType(new T.IntersectionType([
                new T.LiteralType(1),
                new T.LiteralType(2),
            ]), new T.LiteralType("ext"), new T.LiteralType("true"), new T.LiteralType("false"));
            (0, assert_1.strictEqual)(type.toString(), '(1 & 2) extends "ext" ? "true" : "false"');
        });
    });
    describe("Array types", () => {
        it("Does not wrap other array types", () => {
            const type = new T.ArrayType(new T.ArrayType(new T.IntrinsicType("string")));
            (0, assert_1.strictEqual)(type.toString(), "string[][]");
        });
        it("Wraps union types", () => {
            const type = new T.ArrayType(new T.UnionType([new T.LiteralType(1), new T.LiteralType(2)]));
            (0, assert_1.strictEqual)(type.toString(), "(1 | 2)[]");
        });
        it("Wraps intersection types", () => {
            const type = new T.ArrayType(new T.IntersectionType([
                new T.LiteralType(1),
                new T.LiteralType(2),
            ]));
            (0, assert_1.strictEqual)(type.toString(), "(1 & 2)[]");
        });
    });
    describe("Unknown types", () => {
        const type = new T.UnknownType("foo");
        it("Should not be wrapped when root level", () => {
            (0, assert_1.strictEqual)(type.toString(), "foo");
        });
        it("Should be wrapped everywhere", () => {
            const arr = new T.ArrayType(type);
            (0, assert_1.strictEqual)(arr.toString(), "(foo)[]");
            const union = new T.UnionType([type, type]);
            (0, assert_1.strictEqual)(union.toString(), "(foo) | (foo)");
            const intersection = new T.IntersectionType([type, type]);
            (0, assert_1.strictEqual)(intersection.toString(), "(foo) & (foo)");
        });
    });
    describe("Indexed access types", () => {
        it("Renders", () => {
            const type = new T.IndexedAccessType(new T.IntrinsicType("string"), new T.LiteralType("length"));
            (0, assert_1.strictEqual)(type.toString(), 'string["length"]');
        });
    });
    describe("Inferred types", () => {
        it("Renders", () => {
            const type = new T.InferredType("TFoo");
            (0, assert_1.strictEqual)(type.toString(), "infer TFoo");
        });
        it("Renders with a constraint", () => {
            const type = new T.InferredType("TFoo", new T.LiteralType(123));
            (0, assert_1.strictEqual)(type.toString(), "infer TFoo extends 123");
        });
    });
    describe("Mapped types", () => {
        it("Renders a simple case", () => {
            const type = new T.MappedType("K", new T.LiteralType(1), new T.LiteralType(2), undefined, undefined, undefined);
            (0, assert_1.strictEqual)(type.toString(), "{ [K in 1]: 2 }");
        });
        it("Renders with readonly modifiers", () => {
            const type = new T.MappedType("K", new T.LiteralType(1), new T.LiteralType(2), "+", undefined, undefined);
            (0, assert_1.strictEqual)(type.toString(), "{ readonly [K in 1]: 2 }");
            const type2 = new T.MappedType("K", new T.LiteralType(1), new T.LiteralType(2), "-", undefined, undefined);
            (0, assert_1.strictEqual)(type2.toString(), "{ -readonly [K in 1]: 2 }");
        });
        it("Renders with optional modifiers", () => {
            const type = new T.MappedType("K", new T.LiteralType(1), new T.LiteralType(2), undefined, "+", undefined);
            (0, assert_1.strictEqual)(type.toString(), "{ [K in 1]?: 2 }");
            const type2 = new T.MappedType("K", new T.LiteralType(1), new T.LiteralType(2), undefined, "-", undefined);
            (0, assert_1.strictEqual)(type2.toString(), "{ [K in 1]-?: 2 }");
        });
        it("Renders with name modifiers", () => {
            const type = new T.MappedType("K", new T.LiteralType(1), new T.LiteralType(2), undefined, undefined, new T.LiteralType(3));
            (0, assert_1.strictEqual)(type.toString(), "{ [K in 1 as 3]: 2 }");
        });
    });
    describe("Optional type", () => {
        it("Renders a simple case", () => {
            const type = new T.OptionalType(new T.LiteralType(1));
            (0, assert_1.strictEqual)(type.toString(), "1?");
        });
        it("Wraps intersections", () => {
            const type = new T.OptionalType(new T.IntersectionType([
                new T.LiteralType(1),
                new T.LiteralType(2),
            ]));
            (0, assert_1.strictEqual)(type.toString(), "(1 & 2)?");
        });
        it("Wraps type operators", () => {
            const type = new T.OptionalType(new T.TypeOperatorType(new T.LiteralType(1), "keyof"));
            (0, assert_1.strictEqual)(type.toString(), "(keyof 1)?");
        });
        it("Does not wrap type query", () => {
            const project = new models_1.ProjectReflection("test", new FileRegistry_1.FileRegistry());
            const type = new T.OptionalType(new T.QueryType(T.ReferenceType.createResolvedReference("X", -1, project)));
            (0, assert_1.strictEqual)(type.toString(), "typeof X?");
        });
    });
    describe("Tuple", () => {
        it("Works with members", () => {
            const type = new T.TupleType([
                new T.OptionalType(new T.LiteralType(123)),
            ]);
            (0, assert_1.strictEqual)(type.toString(), "[123?]");
        });
    });
    describe("Type operator", () => {
        it("Does not wrap type query", () => {
            const project = new models_1.ProjectReflection("test", new FileRegistry_1.FileRegistry());
            const type = new T.TypeOperatorType(new T.QueryType(T.ReferenceType.createResolvedReference("X", -1, project)), "keyof");
            (0, assert_1.strictEqual)(type.toString(), "keyof typeof X");
        });
    });
    describe("Predicate type", () => {
        it("Works without a type", () => {
            const type = new T.PredicateType("X", true, undefined);
            (0, assert_1.strictEqual)(type.toString(), "asserts X");
        });
        it("Works with a type", () => {
            const type = new T.PredicateType("X", false, new T.LiteralType(1));
            (0, assert_1.strictEqual)(type.toString(), "X is 1");
        });
        it("Works with asserts", () => {
            const type = new T.PredicateType("X", true, new T.LiteralType(1));
            (0, assert_1.strictEqual)(type.toString(), "asserts X is 1");
        });
    });
    describe("Rest type", () => {
        it("Does not wrap simple types", () => {
            const type = new T.RestType(new T.ArrayType(new T.LiteralType(1)));
            (0, assert_1.strictEqual)(type.toString(), "...1[]");
        });
    });
    describe("Template literal type", () => {
        it("Renders", () => {
            const type = new T.TemplateLiteralType("a", [
                [new T.IntrinsicType("string"), "b"],
            ]);
            (0, assert_1.strictEqual)(type.toString(), "`a${string}b`");
        });
    });
});
