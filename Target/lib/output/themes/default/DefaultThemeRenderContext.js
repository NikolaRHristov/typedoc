"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultThemeRenderContext = void 0;
const default_1 = require("./layouts/default");
const partials_1 = require("./partials");
const breadcrumb_1 = require("./partials/breadcrumb");
const comment_1 = require("./partials/comment");
const footer_1 = require("./partials/footer");
const header_1 = require("./partials/header");
const hierarchy_1 = require("./partials/hierarchy");
const icon_1 = require("./partials/icon");
const member_1 = require("./partials/member");
const member_declaration_1 = require("./partials/member.declaration");
const member_getterSetter_1 = require("./partials/member.getterSetter");
const member_reference_1 = require("./partials/member.reference");
const member_signature_body_1 = require("./partials/member.signature.body");
const member_signature_title_1 = require("./partials/member.signature.title");
const member_signatures_1 = require("./partials/member.signatures");
const member_sources_1 = require("./partials/member.sources");
const members_1 = require("./partials/members");
const navigation_1 = require("./partials/navigation");
const parameter_1 = require("./partials/parameter");
const reflectionPreview_1 = require("./partials/reflectionPreview");
const toolbar_1 = require("./partials/toolbar");
const type_1 = require("./partials/type");
const typeAndParent_1 = require("./partials/typeAndParent");
const typeParameters_1 = require("./partials/typeParameters");
const templates_1 = require("./templates");
const document_1 = require("./templates/document");
const hierarchy_2 = require("./templates/hierarchy");
const reflection_1 = require("./templates/reflection");
function bind(fn, first) {
    return (...r) => fn(first, ...r);
}
class DefaultThemeRenderContext {
    constructor(theme, page, options) {
        this.theme = theme;
        this.page = page;
        this.hook = (...params) => {
            return this.theme.owner.hooks.emit(...params);
        };
        /** Avoid this in favor of urlTo if possible */
        this.relativeURL = (url, cacheBust = false) => {
            const result = this.theme.markedPlugin.getRelativeUrl(url);
            if (cacheBust && this.theme.owner.cacheBust) {
                return result + `?cache=${this.theme.owner.renderStartTime}`;
            }
            return result;
        };
        this.urlTo = (reflection) => {
            return reflection.url ? this.relativeURL(reflection.url) : "";
        };
        this.markdown = (md) => {
            return this.theme.markedPlugin.parseMarkdown(md || "", this.page, this);
        };
        this.getNavigation = () => this.theme.getNavigation(this.page.project);
        this.getReflectionClasses = (refl) => this.theme.getReflectionClasses(refl);
        this.documentTemplate = bind(document_1.documentTemplate, this);
        this.reflectionTemplate = bind(reflection_1.reflectionTemplate, this);
        this.indexTemplate = bind(templates_1.indexTemplate, this);
        this.hierarchyTemplate = bind(hierarchy_2.hierarchyTemplate, this);
        this.defaultLayout = bind(default_1.defaultLayout, this);
        /**
         * Rendered just after the description for a reflection.
         * This can be used to render a shortened type display of a reflection that the
         * rest of the page expands on.
         *
         * Note: Will not be called for variables/type aliases, as they are summarized
         * by their type declaration, which is already rendered by {@link DefaultThemeRenderContext.memberDeclaration}
         */
        this.reflectionPreview = bind(reflectionPreview_1.reflectionPreview, this);
        this.breadcrumb = bind(breadcrumb_1.breadcrumb, this);
        this.commentSummary = bind(comment_1.commentSummary, this);
        this.commentTags = bind(comment_1.commentTags, this);
        this.reflectionFlags = bind(comment_1.reflectionFlags, this);
        this.footer = bind(footer_1.footer, this);
        this.header = bind(header_1.header, this);
        this.hierarchy = bind(hierarchy_1.hierarchy, this);
        this.index = bind(partials_1.index, this);
        this.member = bind(member_1.member, this);
        this.memberDeclaration = bind(member_declaration_1.memberDeclaration, this);
        this.memberGetterSetter = bind(member_getterSetter_1.memberGetterSetter, this);
        this.memberReference = bind(member_reference_1.memberReference, this);
        this.memberSignatureBody = bind(member_signature_body_1.memberSignatureBody, this);
        this.memberSignatureTitle = bind(member_signature_title_1.memberSignatureTitle, this);
        this.memberSignatures = bind(member_signatures_1.memberSignatures, this);
        this.memberSources = bind(member_sources_1.memberSources, this);
        this.members = bind(members_1.members, this);
        this.sidebar = bind(navigation_1.sidebar, this);
        this.pageSidebar = bind(navigation_1.pageSidebar, this);
        this.sidebarLinks = bind(navigation_1.sidebarLinks, this);
        this.settings = bind(navigation_1.settings, this);
        this.navigation = bind(navigation_1.navigation, this);
        this.pageNavigation = bind(navigation_1.pageNavigation, this);
        this.parameter = bind(parameter_1.parameter, this);
        this.toolbar = bind(toolbar_1.toolbar, this);
        this.type = bind(type_1.type, this);
        this.typeAndParent = bind(typeAndParent_1.typeAndParent, this);
        this.typeParameters = bind(typeParameters_1.typeParameters, this);
        this.options = options;
        this.internationalization = theme.application.internationalization;
        this.i18n = this.internationalization.proxy;
        this._refIcons = (0, icon_1.buildRefIcons)(theme.icons, this);
    }
    /**
     * Icons available for use within the page.
     *
     * Note: This creates a reference to icons declared by {@link DefaultTheme.icons},
     * to customize icons, that object must be modified instead.
     */
    get icons() {
        return this._refIcons;
    }
}
exports.DefaultThemeRenderContext = DefaultThemeRenderContext;
