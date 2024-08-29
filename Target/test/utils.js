"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.query = query;
exports.querySig = querySig;
exports.getComment = getComment;
exports.getSigComment = getSigComment;
exports.getLinks = getLinks;
exports.equalKind = equalKind;
const assert_1 = require("assert");
const strict_1 = require("assert/strict");
const __1 = require("..");
const utils_1 = require("../lib/utils");
function query(project, name) {
    const reflection = project.getChildByName(name);
    (0, assert_1.ok)(reflection instanceof __1.DeclarationReflection, `Failed to find ${name}`);
    return reflection;
}
function querySig(project, name, index = 0) {
    const decl = query(project, name);
    (0, assert_1.ok)(decl.signatures?.length ?? 0 > index, `Reflection "${name}" does not contain signature`);
    return decl.signatures[index];
}
function getComment(project, name) {
    return __1.Comment.combineDisplayParts(query(project, name).comment?.summary);
}
function getSigComment(project, name, index = 0) {
    return __1.Comment.combineDisplayParts(querySig(project, name, index).comment?.summary);
}
function getLinks(refl) {
    (0, assert_1.ok)(refl.comment);
    return (0, utils_1.filterMap)(refl.comment.summary, (p) => {
        if (p.kind === "inline-tag" && p.tag === "@link") {
            if (typeof p.target === "string") {
                return { display: p.tsLinkText || p.text, target: p.target };
            }
            if (p.target instanceof __1.Reflection) {
                return {
                    display: p.tsLinkText || p.target.name,
                    target: [p.target.kind, p.target.getFullName()],
                };
            }
            return {
                display: p.tsLinkText || p.text,
                target: p.target?.getStableKey(),
            };
        }
    });
}
function equalKind(refl, kind) {
    (0, strict_1.equal)(refl.kind, kind, `Expected ${__1.ReflectionKind[kind]} but got ${__1.ReflectionKind[refl.kind]}`);
}
