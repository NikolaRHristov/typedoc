"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Context = void 0;
const assert_1 = require("assert");
const typescript_1 = __importDefault(require("typescript"));
const index_1 = require("../models/index");
const tsutils_1 = require("../utils/tsutils");
const comments_1 = require("./comments");
const converter_events_1 = require("./converter-events");
const nodes_1 = require("./utils/nodes");
const symbols_1 = require("./utils/symbols");
/**
 * The context describes the current state the converter is in.
 */
class Context {
    /**
     * The TypeChecker instance returned by the TypeScript compiler.
     */
    get checker() {
        return this.program.getTypeChecker();
    }
    /**
     * Translation interface for log messages.
     */
    get i18n() {
        return this.converter.application.i18n;
    }
    /**
     * The program currently being converted.
     * Accessing this property will throw if a source file is not currently being converted.
     */
    get program() {
        (0, assert_1.ok)(this._program, "Tried to access Context.program when not converting a source file");
        return this._program;
    }
    /**
     * Create a new Context instance.
     *
     * @param converter  The converter instance that has created the context.
     * @internal
     */
    constructor(converter, programs, project, scope = project) {
        this.convertingTypeNode = false; // Inherited by withScope
        this.convertingClassOrInterface = false; // Not inherited
        this.shouldBeStatic = false; // Not inherited
        this.converter = converter;
        this.programs = programs;
        this.project = project;
        this.scope = scope;
    }
    /** @internal */
    get logger() {
        return this.converter.application.logger;
    }
    /**
     * Return the type declaration of the given node.
     *
     * @param node  The TypeScript node whose type should be resolved.
     * @returns The type declaration of the given node.
     */
    getTypeAtLocation(node) {
        let nodeType;
        try {
            nodeType = this.checker.getTypeAtLocation(node);
        }
        catch {
            // ignore
        }
        if (!nodeType) {
            if (node.symbol) {
                nodeType = this.checker.getDeclaredTypeOfSymbol(node.symbol);
                // The TS types lie due to ts.SourceFile
            }
            else if (node.parent?.symbol) {
                nodeType = this.checker.getDeclaredTypeOfSymbol(node.parent.symbol);
                // The TS types lie due to ts.SourceFile
            }
            else if (node.parent?.parent?.symbol) {
                nodeType = this.checker.getDeclaredTypeOfSymbol(node.parent.parent.symbol);
            }
        }
        return nodeType;
    }
    getSymbolAtLocation(node) {
        let symbol = this.checker.getSymbolAtLocation(node);
        if (!symbol && (0, nodes_1.isNamedNode)(node)) {
            symbol = this.checker.getSymbolAtLocation(node.name);
        }
        return symbol;
    }
    expectSymbolAtLocation(node) {
        const symbol = this.getSymbolAtLocation(node);
        if (!symbol) {
            const { line } = typescript_1.default.getLineAndCharacterOfPosition(node.getSourceFile(), node.pos);
            throw new Error(`Expected a symbol for node with kind ${typescript_1.default.SyntaxKind[node.kind]} at ${node.getSourceFile().fileName}:${line + 1}`);
        }
        return symbol;
    }
    resolveAliasedSymbol(symbol) {
        return (0, symbols_1.resolveAliasedSymbol)(symbol, this.checker);
    }
    createDeclarationReflection(kind, symbol, exportSymbol, 
    // We need this because modules don't always have symbols.
    nameOverride) {
        const name = (0, tsutils_1.getHumanName)(nameOverride ?? exportSymbol?.name ?? symbol?.name ?? "unknown");
        if (this.convertingClassOrInterface) {
            if (kind === index_1.ReflectionKind.Function) {
                kind = index_1.ReflectionKind.Method;
            }
            if (kind === index_1.ReflectionKind.Variable) {
                kind = index_1.ReflectionKind.Property;
            }
        }
        const reflection = new index_1.DeclarationReflection(name, kind, this.scope);
        this.postReflectionCreation(reflection, symbol, exportSymbol);
        return reflection;
    }
    postReflectionCreation(reflection, symbol, exportSymbol) {
        if (exportSymbol &&
            reflection.kind &
                (index_1.ReflectionKind.SomeModule | index_1.ReflectionKind.Reference)) {
            reflection.comment = this.getComment(exportSymbol, reflection.kind);
        }
        if (symbol && !reflection.comment) {
            reflection.comment = this.getComment(symbol, reflection.kind);
        }
        if (this.shouldBeStatic) {
            reflection.setFlag(index_1.ReflectionFlag.Static);
        }
        if (reflection instanceof index_1.DeclarationReflection) {
            reflection.escapedName = symbol?.escapedName;
            this.addChild(reflection);
        }
        if (symbol && this.converter.isExternal(symbol)) {
            reflection.setFlag(index_1.ReflectionFlag.External);
        }
        if (exportSymbol) {
            this.registerReflection(reflection, exportSymbol);
        }
        const path = reflection.kindOf(index_1.ReflectionKind.Namespace | index_1.ReflectionKind.Module)
            ? symbol?.declarations?.find(typescript_1.default.isSourceFile)?.fileName
            : undefined;
        this.project.registerReflection(reflection, symbol, path);
    }
    finalizeDeclarationReflection(reflection) {
        this.converter.trigger(converter_events_1.ConverterEvents.CREATE_DECLARATION, this, reflection);
        if (reflection.kindOf(index_1.ReflectionKind.MayContainDocuments)) {
            this.converter.processDocumentTags(reflection, reflection);
        }
    }
    addChild(reflection) {
        if (this.scope instanceof index_1.ContainerReflection) {
            this.scope.addChild(reflection);
        }
    }
    shouldIgnore(symbol) {
        return this.converter.shouldIgnore(symbol);
    }
    /**
     * Register a newly generated reflection. All created reflections should be
     * passed to this method to ensure that the project helper functions work correctly.
     *
     * @param reflection  The reflection that should be registered.
     * @param symbol  The symbol the given reflection was resolved from.
     */
    registerReflection(reflection, symbol) {
        this.project.registerReflection(reflection, symbol, void 0);
    }
    /** @internal */
    setActiveProgram(program) {
        this._program = program;
    }
    getComment(symbol, kind) {
        return (0, comments_1.getComment)(symbol, kind, this.converter.config, this.logger, this.checker, this.project.files);
    }
    getNodeComment(node, moduleComment) {
        return (0, comments_1.getNodeComment)(node, moduleComment, this.converter.config, this.logger, this.checker, this.project.files);
    }
    getFileComment(node) {
        return (0, comments_1.getFileComment)(node, this.converter.config, this.logger, this.checker, this.project.files);
    }
    getJsDocComment(declaration) {
        return (0, comments_1.getJsDocComment)(declaration, this.converter.config, this.logger, this.checker, this.project.files);
    }
    getSignatureComment(declaration) {
        return (0, comments_1.getSignatureComment)(declaration, this.converter.config, this.logger, this.checker, this.project.files);
    }
    withScope(scope) {
        const context = new Context(this.converter, this.programs, this.project, scope);
        context.convertingTypeNode = this.convertingTypeNode;
        context.setActiveProgram(this._program);
        return context;
    }
}
exports.Context = Context;
