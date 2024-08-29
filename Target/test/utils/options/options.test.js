"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../../lib/utils");
const utils_2 = require("../../../lib/utils");
const assert_1 = require("assert");
const internationalization_1 = require("../../../lib/internationalization/internationalization");
describe("Options", () => {
    let options;
    beforeEach(() => {
        options = new utils_1.Options(new internationalization_1.Internationalization(null).proxy);
        options.addDeclaration({
            name: "mapped",
            type: utils_1.ParameterType.Map,
            map: { a: 1 },
            defaultValue: 2,
            help: () => "",
        });
    });
    it("Errors on duplicate declarations", () => {
        let threw = false;
        try {
            options.addDeclaration({
                name: "help",
                help: () => "",
                type: utils_1.ParameterType.Boolean,
            });
        }
        catch {
            threw = true;
        }
        (0, assert_1.deepStrictEqual)(threw, true);
    });
    it("Does not throw if number declaration has no min and max values", () => {
        const declaration = {
            name: "test-number-declaration",
            help: () => "",
            type: utils_1.ParameterType.Number,
            defaultValue: 1,
        };
        options.addDeclaration(declaration);
    });
    it("Does not throw if default value is out of range for number declaration", () => {
        const declaration = {
            name: "test-number-declaration",
            help: () => "",
            type: utils_1.ParameterType.Number,
            minValue: 1,
            maxValue: 10,
            defaultValue: 0,
        };
        options.addDeclaration(declaration);
    });
    it("Does not throw if a map declaration has a default value that is not part of the map of possible values", () => {
        const declaration = {
            name: "testMapDeclarationWithForeignDefaultValue",
            help: () => "",
            type: utils_1.ParameterType.Map,
            map: new Map([
                ["a", 1],
                ["b", 2],
            ]),
            defaultValue: 0,
        };
        options.addDeclaration(declaration);
    });
    it("Throws on attempt to get an undeclared option", () => {
        (0, assert_1.throws)(() => options.getValue("does-not-exist"));
    });
    it("Does not allow fetching compiler options through getValue", () => {
        (0, assert_1.throws)(() => options.getValue("target"));
    });
    it("Errors if converting a set value errors", () => {
        (0, assert_1.throws)(() => options.setValue("mapped", "nonsense"));
    });
    it("Errors if setting flags to an invalid value", () => {
        (0, assert_1.throws)(() => options.setValue("validation", "bad"));
        (0, assert_1.throws)(() => options.setValue("validation", void 0));
        (0, assert_1.throws)(() => options.setValue("validation", { notExported: "bad" }));
    });
    it("Errors if setting a flag which does not exist", () => {
        (0, assert_1.throws)(() => options.setValue("validation", { doesNotExist: true }));
    });
    it("Allows setting flag objects to true/false", () => {
        options.setValue("validation", true);
        (0, assert_1.deepStrictEqual)(options.getValue("validation"), {
            notExported: true,
            notDocumented: true,
            invalidLink: true,
        });
        options.setValue("validation", false);
        (0, assert_1.deepStrictEqual)(options.getValue("validation"), {
            notExported: false,
            notDocumented: false,
            invalidLink: false,
        });
    });
    it("Resets a flag to the default if set to null", () => {
        const options = new utils_1.Options(new internationalization_1.Internationalization(null).proxy);
        options.setValue("validation", { notExported: true });
        options.setValue("validation", { notExported: null });
        (0, assert_1.deepStrictEqual)(options.getValue("validation").notExported, true);
        options.setValue("validation", { notExported: false });
        options.setValue("validation", { notExported: null });
        (0, assert_1.deepStrictEqual)(options.getValue("validation").notExported, true);
    });
    it("Handles mapped enums properly", () => {
        const options = new utils_1.Options(new internationalization_1.Internationalization(null).proxy);
        (0, assert_1.deepStrictEqual)(options.getValue("logLevel"), utils_1.LogLevel.Info);
        options.setValue("logLevel", utils_1.LogLevel.Error);
        (0, assert_1.deepStrictEqual)(options.getValue("logLevel"), utils_1.LogLevel.Error);
        options.setValue("logLevel", "Verbose");
        (0, assert_1.deepStrictEqual)(options.getValue("logLevel"), utils_1.LogLevel.Verbose);
    });
    it("Supports directly getting values", () => {
        (0, assert_1.deepStrictEqual)(options.getRawValues().entryPoints, []);
    });
    it("Supports checking if an option is set", () => {
        const options = new utils_1.Options(new internationalization_1.Internationalization(null).proxy);
        (0, assert_1.deepStrictEqual)(options.isSet("excludePrivate"), false);
        options.setValue("excludePrivate", false);
        (0, assert_1.deepStrictEqual)(options.isSet("excludePrivate"), true);
        options.reset();
        (0, assert_1.deepStrictEqual)(options.isSet("excludePrivate"), false);
        (0, assert_1.throws)(() => options.isSet("does not exist"));
    });
    it("Throws if frozen and a value is set", () => {
        const options = new utils_1.Options(new internationalization_1.Internationalization(null).proxy);
        options.freeze();
        (0, assert_1.throws)(() => options.setValue("categorizeByGroup", true));
        (0, assert_1.throws)(() => options.setCompilerOptions([], {}, []));
    });
    it("Supports resetting values", () => {
        const options = new utils_1.Options(new internationalization_1.Internationalization(null).proxy);
        options.setValue("entryPoints", ["x"]);
        const oldExcludeTags = options.getValue("excludeTags");
        options.setValue("excludeTags", ["@x"]);
        options.reset();
        (0, assert_1.deepStrictEqual)(options.getValue("entryPoints"), []);
        (0, assert_1.deepStrictEqual)(options.getValue("excludeTags"), oldExcludeTags);
    });
    it("Supports resetting a single value", () => {
        const options = new utils_1.Options(new internationalization_1.Internationalization(null).proxy);
        options.setValue("name", "test");
        const originalExclude = options.getValue("excludeTags");
        options.setValue("excludeTags", ["@x"]);
        options.reset("excludeTags");
        (0, assert_1.deepStrictEqual)(options.getValue("name"), "test");
        (0, assert_1.deepStrictEqual)(options.getValue("excludeTags"), originalExclude);
    });
    it("Throws if resetting a single value which does not exist", () => {
        const options = new utils_1.Options(new internationalization_1.Internationalization(null).proxy);
        (0, assert_1.throws)(() => options.reset("thisOptionDoesNotExist"));
    });
});
describe("Option", () => {
    let Container = (() => {
        var _a, _Container_emit_accessor_storage;
        let _emit_decorators;
        let _emit_initializers = [];
        let _emit_extraInitializers = [];
        return _a = class Container {
                constructor(options) {
                    this.options = options;
                    _Container_emit_accessor_storage.set(this, __runInitializers(this, _emit_initializers, void 0));
                    __runInitializers(this, _emit_extraInitializers);
                    this.options = options;
                }
                get emit() { return __classPrivateFieldGet(this, _Container_emit_accessor_storage, "f"); }
                set emit(value) { __classPrivateFieldSet(this, _Container_emit_accessor_storage, value, "f"); }
            },
            _Container_emit_accessor_storage = new WeakMap(),
            (() => {
                const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
                _emit_decorators = [(0, utils_2.Option)("emit")];
                __esDecorate(_a, null, _emit_decorators, { kind: "accessor", name: "emit", static: false, private: false, access: { has: obj => "emit" in obj, get: obj => obj.emit, set: (obj, value) => { obj.emit = value; } }, metadata: _metadata }, _emit_initializers, _emit_extraInitializers);
                if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            })(),
            _a;
    })();
    it("Supports fetching options", () => {
        const options = new utils_1.Options(new internationalization_1.Internationalization(null).proxy);
        const container = new Container(options);
        (0, assert_1.deepStrictEqual)(container.emit, "docs");
    });
    it("Updates as option values change", () => {
        const options = new utils_1.Options(new internationalization_1.Internationalization(null).proxy);
        const container = new Container(options);
        (0, assert_1.deepStrictEqual)(container.emit, "docs");
        options.setValue("emit", "both");
        (0, assert_1.deepStrictEqual)(container.emit, "both");
    });
});
