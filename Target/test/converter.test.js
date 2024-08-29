"use strict";
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
const FS = __importStar(require("fs"));
const Path = __importStar(require("path"));
const __1 = require("..");
const FileRegistry_1 = require("../lib/models/FileRegistry");
const utils_1 = require("../lib/utils");
const programs_1 = require("./programs");
const comparisonSerializer = new __1.Serializer();
comparisonSerializer.addSerializer({
    priority: 0,
    supports(x) {
        return x instanceof __1.ReferenceType;
    },
    toObject(ref, obj) {
        if (ref.reflection) {
            obj.target = ref.reflection.getFullName();
        }
        return obj;
    },
});
comparisonSerializer.addSerializer({
    priority: 0,
    supports(x) {
        return x instanceof __1.Comment;
    },
    toObject(comment, obj) {
        obj.summary.forEach((part, i) => {
            if (part.kind === "inline-tag" && typeof part.target === "number") {
                const origPart = comment.summary[i];
                part.target = origPart.target.getFullName();
            }
        });
        return obj;
    },
});
comparisonSerializer.addSerializer({
    priority: 0,
    supports(x) {
        return x instanceof __1.CommentTag;
    },
    toObject(tag, obj) {
        obj["content"].forEach((part, i) => {
            if (part.kind === "inline-tag" &&
                typeof part.target === "number") {
                part.target = tag.content[i].target.getFullName();
            }
        });
        return obj;
    },
});
comparisonSerializer.addSerializer({
    priority: 0,
    supports(x) {
        return x instanceof __1.Reflection;
    },
    toObject(_refl, obj) {
        delete obj["id"];
        return obj;
    },
});
comparisonSerializer.addSerializer({
    priority: 0,
    supports(x) {
        return x instanceof __1.ReferenceReflection;
    },
    toObject(refl, obj) {
        obj.target = refl.getTargetReflectionDeep().getFullName();
        return obj;
    },
});
comparisonSerializer.addSerializer({
    priority: 0,
    supports(x) {
        return x instanceof __1.ReflectionCategory || x instanceof __1.ReflectionGroup;
    },
    toObject(refl, obj) {
        obj.children = refl.children.map((c) => c.getFullName());
        return obj;
    },
});
comparisonSerializer.addSerializer({
    priority: -1,
    supports(obj) {
        return obj instanceof __1.SourceReference;
    },
    toObject(ref, obj, _serializer) {
        if (obj.url) {
            obj.url = `typedoc://${obj.url.substring(obj.url.indexOf(ref.fileName))}`;
        }
        return obj;
    },
});
comparisonSerializer.addSerializer({
    priority: -1,
    supports(obj) {
        return obj instanceof __1.ProjectReflection;
    },
    toObject(project, obj) {
        const idMap = {};
        for (const [k, v] of Object.entries(obj.symbolIdMap || {})) {
            idMap[project.getReflectionById(+k).getFullName()] = v;
        }
        obj.symbolIdMap = idMap;
        delete obj.packageVersion;
        return obj;
    },
});
comparisonSerializer.addSerializer({
    priority: -1,
    supports(obj) {
        return obj instanceof FileRegistry_1.FileRegistry;
    },
    toObject(_media, obj) {
        obj.reflections = {};
        return obj;
    },
});
describe("Converter", function () {
    const base = (0, programs_1.getConverterBase)();
    const app = (0, programs_1.getConverterApp)();
    it("Compiles", () => {
        (0, programs_1.getConverterProgram)();
    });
    const checks = [
        [
            "specs",
            () => {
                // nop
            },
            () => {
                // nop
            },
        ],
        [
            "specs-with-lump-categories",
            () => app.options.setValue("categorizeByGroup", false),
            () => app.options.setValue("categorizeByGroup", true),
        ],
        [
            "specs.nodoc",
            () => app.options.setValue("excludeNotDocumented", true),
            () => app.options.setValue("excludeNotDocumented", false),
        ],
    ];
    FS.readdirSync(base).forEach(function (directory) {
        const path = Path.join(base, directory);
        if (!FS.lstatSync(path).isDirectory()) {
            return;
        }
        describe(directory, function () {
            for (const [file, before, after] of checks) {
                const specsFile = Path.join(path, `${file}.json`);
                if (!FS.existsSync(specsFile)) {
                    continue;
                }
                const specs = JSON.parse(FS.readFileSync(specsFile, "utf-8"));
                let result;
                it(`[${file}] converts fixtures`, function () {
                    before();
                    (0, __1.resetReflectionID)();
                    app.files = new FileRegistry_1.ValidatingFileRegistry();
                    const entryPoints = (0, utils_1.getExpandedEntryPointsForPaths)(app.logger, [path], app.options, [(0, programs_1.getConverterProgram)()]);
                    (0, assert_1.ok)(entryPoints, "Failed to get entry points");
                    result = app.converter.convert(entryPoints);
                    result.name = directory;
                    after();
                });
                it(`[${file}] matches specs`, function () {
                    // Pass data through a parse/stringify to get rid of undefined properties
                    const data = JSON.parse(JSON.stringify(app.serializer.projectToObject(result, process.cwd())));
                    delete data.symbolIdMap;
                    const specCopy = { ...specs };
                    delete specCopy.symbolIdMap;
                    (0, assert_1.deepStrictEqual)(data, specCopy);
                });
                it(`[${file}] round trips revival`, () => {
                    const revived = app.deserializer.reviveProject(specs, specs.name, process.cwd(), new FileRegistry_1.FileRegistry());
                    const specs2 = JSON.parse(JSON.stringify(comparisonSerializer.projectToObject(revived, process.cwd())));
                    // Pass data through a parse/stringify to get rid of undefined properties
                    const data = JSON.parse(JSON.stringify(comparisonSerializer.projectToObject(result, process.cwd())));
                    (0, assert_1.deepStrictEqual)(data, specs2);
                });
            }
        });
    });
});
//# sourceMappingURL=converter.test.js.map