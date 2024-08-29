/**
 * Module which handles sorting reflections according to a user specified strategy.
 * @module
 */
import type { DocumentReflection } from "../models";
import type { DeclarationReflection } from "../models/reflections/declaration";
import type { Options } from "./options";
export declare const SORT_STRATEGIES: readonly ["source-order", "alphabetical", "alphabetical-ignoring-documents", "enum-value-ascending", "enum-value-descending", "enum-member-source-order", "static-first", "instance-first", "visibility", "required-first", "kind", "external-last", "documents-first", "documents-last"];
export type SortStrategy = (typeof SORT_STRATEGIES)[number];
export declare function getSortFunction(opts: Options): (reflections: (DeclarationReflection | DocumentReflection)[]) => void;
