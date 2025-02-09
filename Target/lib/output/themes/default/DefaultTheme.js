"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultTheme = exports.Slugger = void 0;
const models_1 = require("../../../models");
const utils_1 = require("../../../utils");
const UrlMapping_1 = require("../../models/UrlMapping");
const theme_1 = require("../../theme");
const lib_1 = require("../lib");
const DefaultThemeRenderContext_1 = require("./DefaultThemeRenderContext");
const icon_1 = require("./partials/icon");
/**
 * Responsible for getting a unique anchor for elements within a page.
 */
class Slugger {
    constructor() {
        this.seen = new Map();
    }
    serialize(value) {
        // Extracted from marked@4.3.0
        return (value
            .toLowerCase()
            .trim()
            // remove html tags
            .replace(/<[!/a-z].*?>/gi, "")
            // remove unwanted chars
            .replace(/[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,./:;<=>?@[\]^`{|}~]/g, "")
            .replace(/\s/g, "-"));
    }
    slug(value) {
        const originalSlug = this.serialize(value);
        let slug = originalSlug;
        let count = 0;
        if (this.seen.has(slug)) {
            count = this.seen.get(originalSlug);
            do {
                count++;
                slug = `${originalSlug}-${count}`;
            } while (this.seen.has(slug));
        }
        this.seen.set(originalSlug, count);
        this.seen.set(slug, 0);
        return slug;
    }
}
exports.Slugger = Slugger;
/**
 * Default theme implementation of TypeDoc. If a theme does not provide a custom
 * {@link Theme} implementation, this theme class will be used.
 */
class DefaultTheme extends theme_1.Theme {
    getRenderContext(pageEvent) {
        return new DefaultThemeRenderContext_1.DefaultThemeRenderContext(this, pageEvent, this.application.options);
    }
    getReflectionClasses(reflection) {
        const filters = this.application.options.getValue("visibilityFilters");
        return getReflectionClasses(reflection, filters);
    }
    /**
     * Create a new DefaultTheme instance.
     *
     * @param renderer  The renderer this theme is attached to.
     */
    constructor(renderer) {
        super(renderer);
        /**
         * The icons which will actually be rendered. The source of truth lives on the theme, and
         * the {@link DefaultThemeRenderContext.icons} member will produce references to these.
         *
         * These icons will be written twice. Once to an `icons.svg` file in the assets directory
         * which will be referenced by icons on the context, and once to an `icons.js` file so that
         * references to the icons can be dynamically embedded within the page for use by the search
         * dropdown and when loading the page on `file://` urls.
         *
         * Custom themes may overwrite this entire object or individual properties on it to customize
         * the icons used within the page, however TypeDoc currently assumes that all icons are svg
         * elements, so custom themes must also use svg elements.
         */
        this.icons = { ...icon_1.icons };
        this.documentTemplate = (pageEvent) => {
            return this.getRenderContext(pageEvent).documentTemplate(pageEvent);
        };
        this.reflectionTemplate = (pageEvent) => {
            return this.getRenderContext(pageEvent).reflectionTemplate(pageEvent);
        };
        this.indexTemplate = (pageEvent) => {
            return this.getRenderContext(pageEvent).indexTemplate(pageEvent);
        };
        this.hierarchyTemplate = (pageEvent) => {
            return this.getRenderContext(pageEvent).hierarchyTemplate(pageEvent);
        };
        this.defaultLayoutTemplate = (pageEvent, template) => {
            return this.getRenderContext(pageEvent).defaultLayout(template, pageEvent);
        };
        /**
         * Mappings of reflections kinds to templates used by this theme.
         */
        this.mappings = [
            {
                kind: [models_1.ReflectionKind.Class],
                directory: "classes",
                template: this.reflectionTemplate,
            },
            {
                kind: [models_1.ReflectionKind.Interface],
                directory: "interfaces",
                template: this.reflectionTemplate,
            },
            {
                kind: [models_1.ReflectionKind.Enum],
                directory: "enums",
                template: this.reflectionTemplate,
            },
            {
                kind: [models_1.ReflectionKind.Namespace, models_1.ReflectionKind.Module],
                directory: "modules",
                template: this.reflectionTemplate,
            },
            {
                kind: [models_1.ReflectionKind.TypeAlias],
                directory: "types",
                template: this.reflectionTemplate,
            },
            {
                kind: [models_1.ReflectionKind.Function],
                directory: "functions",
                template: this.reflectionTemplate,
            },
            {
                kind: [models_1.ReflectionKind.Variable],
                directory: "variables",
                template: this.reflectionTemplate,
            },
            {
                kind: [models_1.ReflectionKind.Document],
                directory: "documents",
                template: this.documentTemplate,
            },
        ];
        this.sluggers = new Map();
        this.markedPlugin = renderer.getComponent("marked");
    }
    /**
     * Map the models of the given project to the desired output files.
     *
     * @param project  The project whose urls should be generated.
     * @returns        A list of {@link UrlMapping} instances defining which models
     *                 should be rendered to which files.
     */
    getUrls(project) {
        const urls = [];
        this.sluggers.set(project, new Slugger());
        if (!hasReadme(this.application.options.getValue("readme"))) {
            project.url = "index.html";
            urls.push(new UrlMapping_1.UrlMapping("index.html", project, this.reflectionTemplate));
        }
        else if (project.children?.every((child) => child.kindOf(models_1.ReflectionKind.Module))) {
            // If there are no non-module children, then there's no point in having a modules page since there
            // will be nothing on it besides the navigation, so redirect the module page to the readme page
            project.url = "index.html";
            urls.push(new UrlMapping_1.UrlMapping("index.html", project, this.indexTemplate));
        }
        else {
            project.url = "modules.html";
            urls.push(new UrlMapping_1.UrlMapping("modules.html", project, this.reflectionTemplate));
            urls.push(new UrlMapping_1.UrlMapping("index.html", project, this.indexTemplate));
        }
        if ((0, lib_1.getHierarchyRoots)(project).length) {
            urls.push(new UrlMapping_1.UrlMapping("hierarchy.html", project, this.hierarchyTemplate));
        }
        project.childrenIncludingDocuments?.forEach((child) => this.buildUrls(child, urls));
        return urls;
    }
    /**
     * Return a url for the given reflection.
     *
     * @param reflection  The reflection the url should be generated for.
     * @param relative    The parent reflection the url generation should stop on.
     * @param separator   The separator used to generate the url.
     * @returns           The generated url.
     */
    static getUrl(reflection, relative, separator = ".") {
        let url = reflection.getAlias();
        if (reflection.parent &&
            reflection.parent !== relative &&
            !(reflection.parent instanceof models_1.ProjectReflection)) {
            url =
                DefaultTheme.getUrl(reflection.parent, relative, separator) +
                    separator +
                    url;
        }
        return url;
    }
    /**
     * Return the template mapping for the given reflection.
     *
     * @param reflection  The reflection whose mapping should be resolved.
     * @returns           The found mapping or undefined if no mapping could be found.
     */
    getMapping(reflection) {
        return this.mappings.find((mapping) => reflection.kindOf(mapping.kind));
    }
    /**
     * Build the url for the the given reflection and all of its children.
     *
     * @param reflection  The reflection the url should be created for.
     * @param urls        The array the url should be appended to.
     * @returns           The altered urls array.
     */
    buildUrls(reflection, urls) {
        const mapping = this.getMapping(reflection);
        if (mapping) {
            if (!reflection.url ||
                !DefaultTheme.URL_PREFIX.test(reflection.url)) {
                const url = [
                    mapping.directory,
                    DefaultTheme.getUrl(reflection) + ".html",
                ].join("/");
                urls.push(new UrlMapping_1.UrlMapping(url, reflection, mapping.template));
                this.sluggers.set(reflection, new Slugger());
                reflection.url = url;
                reflection.hasOwnDocument = true;
            }
            reflection.traverse((child) => {
                if (child.isDeclaration() || child.isDocument()) {
                    this.buildUrls(child, urls);
                }
                else {
                    DefaultTheme.applyAnchorUrl(child, reflection);
                }
                return true;
            });
        }
        else if (reflection.parent) {
            DefaultTheme.applyAnchorUrl(reflection, reflection.parent);
        }
        return urls;
    }
    render(page, template) {
        const templateOutput = this.defaultLayoutTemplate(page, template);
        return "<!DOCTYPE html>" + utils_1.JSX.renderElement(templateOutput) + "\n";
    }
    /**
     * If implementing a custom theme, it is recommended to override {@link buildNavigation} instead.
     */
    getNavigation(project) {
        // This is ok because currently TypeDoc wipes out the theme after each render.
        // Might need to change in the future, but it's fine for now.
        if (this._navigationCache) {
            return this._navigationCache;
        }
        return (this._navigationCache = this.buildNavigation(project));
    }
    buildNavigation(project) {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const theme = this;
        const opts = this.application.options.getValue("navigation");
        const leaves = this.application.options.getValue("navigationLeaves");
        return getNavigationElements(project) || [];
        function toNavigation(element) {
            const children = getNavigationElements(element);
            if (element instanceof models_1.ReflectionCategory ||
                element instanceof models_1.ReflectionGroup) {
                if (!children?.length) {
                    return;
                }
                return {
                    text: element.title,
                    children,
                };
            }
            if (opts.excludeReferences &&
                element instanceof models_1.ReferenceReflection) {
                return;
            }
            return {
                text: (0, lib_1.getDisplayName)(element),
                path: element.url,
                kind: element.kind,
                class: (0, lib_1.classNames)({ deprecated: element.isDeprecated() }, theme.getReflectionClasses(element)),
                children: children?.length ? children : undefined,
            };
        }
        function getNavigationElements(parent) {
            if (parent instanceof models_1.ReflectionCategory) {
                return (0, utils_1.filterMap)(parent.children, toNavigation);
            }
            if (parent instanceof models_1.ReflectionGroup) {
                if (shouldShowCategories(parent.owningReflection, opts) &&
                    parent.categories) {
                    return (0, utils_1.filterMap)(parent.categories, toNavigation);
                }
                return (0, utils_1.filterMap)(parent.children, toNavigation);
            }
            if (leaves.includes(parent.getFullName())) {
                return;
            }
            if (!parent.kindOf(models_1.ReflectionKind.MayContainDocuments)) {
                return;
            }
            if (parent.isDocument()) {
                return (0, utils_1.filterMap)(parent.children, toNavigation);
            }
            if (!parent.kindOf(models_1.ReflectionKind.SomeModule | models_1.ReflectionKind.Project)) {
                // Tricky: Non-module children don't show up in the navigation pane,
                //   but any documents added by them should.
                return (0, utils_1.filterMap)(parent.documents, toNavigation);
            }
            if (parent.categories && shouldShowCategories(parent, opts)) {
                return filterMapWithNoneCollection(parent.categories);
            }
            if (parent.groups && shouldShowGroups(parent, opts)) {
                return filterMapWithNoneCollection(parent.groups);
            }
            if (opts.includeFolders &&
                parent.childrenIncludingDocuments?.some((child) => child.name.includes("/"))) {
                return deriveModuleFolders(parent.childrenIncludingDocuments);
            }
            return (0, utils_1.filterMap)(parent.childrenIncludingDocuments, toNavigation);
        }
        function filterMapWithNoneCollection(reflection) {
            const none = reflection.find((x) => x.title.toLocaleLowerCase() === "none");
            const others = reflection.filter((x) => x.title.toLocaleLowerCase() !== "none");
            const mappedOthers = (0, utils_1.filterMap)(others, toNavigation);
            if (none) {
                const noneMappedChildren = (0, utils_1.filterMap)(none.children, toNavigation);
                return [...noneMappedChildren, ...mappedOthers];
            }
            return mappedOthers;
        }
        function deriveModuleFolders(children) {
            const result = [];
            const resolveOrCreateParents = (path, root = result) => {
                if (path.length > 1) {
                    const inner = root.find((el) => el.text === path[0]);
                    if (inner) {
                        inner.children ||= [];
                        return resolveOrCreateParents(path.slice(1), inner.children);
                    }
                    else {
                        root.push({
                            text: path[0],
                            children: [],
                        });
                        return resolveOrCreateParents(path.slice(1), root[root.length - 1].children);
                    }
                }
                return root;
            };
            // Note: This might end up putting a module within another module if we document
            // both foo/index.ts and foo/bar.ts.
            for (const child of children.filter((c) => c.hasOwnDocument)) {
                const nav = toNavigation(child);
                if (nav) {
                    const parts = child.name.split("/");
                    const collection = resolveOrCreateParents(parts);
                    nav.text = parts[parts.length - 1];
                    collection.push(nav);
                }
            }
            // Now merge single-possible-paths together so we don't have folders in our navigation
            // which contain only another single folder.
            if (opts.compactFolders) {
                const queue = [...result];
                while (queue.length) {
                    const review = queue.shift();
                    queue.push(...(review.children || []));
                    if (review.kind || review.path)
                        continue;
                    if (review.children?.length === 1) {
                        const copyFrom = review.children[0];
                        const fullName = `${review.text}/${copyFrom.text}`;
                        delete review.children;
                        Object.assign(review, copyFrom);
                        review.text = fullName;
                        queue.push(review);
                    }
                }
            }
            return result;
        }
    }
    getSlugger(reflection) {
        if (this.sluggers.has(reflection)) {
            return this.sluggers.get(reflection);
        }
        // A slugger should always be defined at least for the project
        return this.getSlugger(reflection.parent);
    }
    /**
     * Generate an anchor url for the given reflection and all of its children.
     *
     * @param reflection  The reflection an anchor url should be created for.
     * @param container   The nearest reflection having an own document.
     */
    static applyAnchorUrl(reflection, container) {
        if (!(reflection instanceof models_1.DeclarationReflection) &&
            !(reflection instanceof models_1.SignatureReflection) &&
            !(reflection instanceof models_1.TypeParameterReflection)) {
            return;
        }
        if (!reflection.url || !DefaultTheme.URL_PREFIX.test(reflection.url)) {
            const anchor = DefaultTheme.getUrl(reflection, container, ".");
            reflection.url = container.url + "#" + anchor;
            reflection.anchor = anchor;
            reflection.hasOwnDocument = false;
        }
        reflection.traverse((child) => {
            DefaultTheme.applyAnchorUrl(child, container);
            return true;
        });
    }
}
exports.DefaultTheme = DefaultTheme;
DefaultTheme.URL_PREFIX = /^(http|ftp)s?:\/\//;
function hasReadme(readme) {
    return !readme.endsWith("none");
}
function getReflectionClasses(reflection, filters) {
    const classes = [];
    // Filter classes should match up with the settings function in
    // partials/navigation.tsx.
    for (const key of Object.keys(filters)) {
        if (key === "inherited") {
            if (reflection.flags.isInherited) {
                classes.push("tsd-is-inherited");
            }
        }
        else if (key === "protected") {
            if (reflection.flags.isProtected) {
                classes.push("tsd-is-protected");
            }
        }
        else if (key === "private") {
            if (reflection.flags.isPrivate) {
                classes.push("tsd-is-private");
            }
        }
        else if (key === "external") {
            if (reflection.flags.isExternal) {
                classes.push("tsd-is-external");
            }
        }
        else if (key.startsWith("@")) {
            if (key === "@deprecated") {
                if (reflection.isDeprecated()) {
                    classes.push((0, lib_1.toStyleClass)(`tsd-is-${key.substring(1)}`));
                }
            }
            else if (reflection.comment?.hasModifier(key) ||
                reflection.comment?.getTag(key)) {
                classes.push((0, lib_1.toStyleClass)(`tsd-is-${key.substring(1)}`));
            }
        }
    }
    return classes.join(" ");
}
function shouldShowCategories(reflection, opts) {
    if (opts.includeCategories) {
        return !reflection.comment?.hasModifier("@hideCategories");
    }
    return reflection.comment?.hasModifier("@showCategories") === true;
}
function shouldShowGroups(reflection, opts) {
    if (opts.includeGroups) {
        return !reflection.comment?.hasModifier("@hideGroups");
    }
    return reflection.comment?.hasModifier("@showGroups") === true;
}
