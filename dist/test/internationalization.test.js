"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = require("assert/strict");
const __1 = require("..");
const fs_1 = require("fs");
const path_1 = require("path");
const translatable_1 = require("../lib/internationalization/translatable");
const set_1 = require("../lib/utils/set");
const tsdoc_defaults_1 = require("../lib/utils/options/tsdoc-defaults");
const allValidTranslationKeys = Object.keys(translatable_1.translatable);
// The tag names do not actually exist in the default locale, but are valid
// for translation, so include them here.
allValidTranslationKeys.push(...tsdoc_defaults_1.blockTags.map((s) => "tag_" + s.substring(1)));
allValidTranslationKeys.push(...tsdoc_defaults_1.modifierTags.map((s) => "tag_" + s.substring(1)));
allValidTranslationKeys.push(...tsdoc_defaults_1.inlineTags.map((s) => "tag_" + s.substring(1)));
describe("Internationalization", () => {
    let app;
    before(async () => {
        app = await __1.Application.bootstrap({}, []);
    });
    afterEach(() => {
        app.options.reset();
    });
    it("Supports getting the list of supported languages", () => {
        const langs = app.internationalization.getSupportedLanguages();
        (0, strict_1.ok)(langs.includes("en"));
        (0, strict_1.ok)(langs.includes("ko"));
        (0, strict_1.ok)(langs.includes("jp"));
    });
    it("Supports translating without placeholders", () => {
        (0, strict_1.deepEqual)(app.i18n.no_entry_points_to_merge(), "No entry points provided to merge");
        app.options.setValue("lang", "zh");
        (0, strict_1.deepEqual)(app.i18n.no_entry_points_to_merge(), "没有提供合并的入口点");
    });
    it("Supports translating with placeholders", () => {
        (0, strict_1.deepEqual)(app.i18n.docs_generated_at_0("X"), "Documentation generated at X");
        app.options.setValue("lang", "zh");
        (0, strict_1.deepEqual)(app.i18n.docs_generated_at_0("X"), "文档生成于 X");
    });
});
describe("Locales", () => {
    const localeRoot = (0, path_1.join)(__dirname, "../lib/internationalization/locales");
    for (const locale of (0, fs_1.readdirSync)(localeRoot)) {
        it(`${locale} defines a valid locale`, () => {
            // eslint-disable-next-line @typescript-eslint/no-require-imports
            const translations = require((0, path_1.join)(localeRoot, locale));
            for (const [key, translation] of Object.entries(translations)) {
                const validPlaceholders = Array.from(key.matchAll(/_(\d+)_|(\d+)$/g), (m) => m[1] || m[2]);
                for (const placeholder of translation.matchAll(/\{(\d+?)\}/g)) {
                    (0, strict_1.ok)(validPlaceholders.includes(placeholder[1]), `${key} translation references "${placeholder[0]}" which will not be available at runtime.`);
                }
            }
            const extraKeys = Array.from((0, set_1.setDifference)(Object.keys(translations), allValidTranslationKeys));
            (0, strict_1.deepEqual)(extraKeys, [], `${locale} defines translations which do not exist in the default locale.`);
        });
    }
});
//# sourceMappingURL=internationalization.test.js.map