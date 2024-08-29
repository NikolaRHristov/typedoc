"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.memberSignatureBody = memberSignatureBody;
const models_1 = require("../../../../models");
const utils_1 = require("../../../../utils");
const lib_1 = require("../../lib");
function memberSignatureBody(context, props, { hideSources = false } = {}) {
    const returnsTag = props.comment?.getTag("@returns");
    return (utils_1.JSX.createElement(utils_1.JSX.Fragment, null,
        context.reflectionFlags(props),
        context.commentSummary(props),
        (0, lib_1.hasTypeParameters)(props) &&
            context.typeParameters(props.typeParameters),
        props.parameters && props.parameters.length > 0 && (utils_1.JSX.createElement("div", { class: "tsd-parameters" },
            utils_1.JSX.createElement("h4", { class: "tsd-parameters-title" }, context.i18n.kind_plural_parameter()),
            utils_1.JSX.createElement("ul", { class: "tsd-parameter-list" }, props.parameters.map((item) => (utils_1.JSX.createElement("li", null,
                utils_1.JSX.createElement("span", null,
                    context.reflectionFlags(item),
                    !!item.flags.isRest && (utils_1.JSX.createElement("span", { class: "tsd-signature-symbol" }, "...")),
                    utils_1.JSX.createElement("span", { class: "tsd-kind-parameter" }, item.name),
                    ": ",
                    context.type(item.type),
                    item.defaultValue != null && (utils_1.JSX.createElement("span", { class: "tsd-signature-symbol" },
                        " = ",
                        item.defaultValue))),
                context.commentSummary(item),
                context.commentTags(item),
                item.type instanceof models_1.ReflectionType &&
                    context.parameter(item.type.declaration))))))),
        props.type && (utils_1.JSX.createElement(utils_1.JSX.Fragment, null,
            utils_1.JSX.createElement("h4", { class: "tsd-returns-title" },
                context.i18n.theme_returns(),
                " ",
                context.type(props.type)),
            returnsTag && (utils_1.JSX.createElement(utils_1.Raw, { html: context.markdown(returnsTag.content) })),
            props.type instanceof models_1.ReflectionType &&
                context.parameter(props.type.declaration))),
        context.commentTags(props),
        !hideSources && context.memberSources(props)));
}
