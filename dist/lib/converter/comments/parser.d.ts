import type { CommentParserConfig } from ".";
import { Comment, type CommentDisplayPart } from "../../models";
import { FileRegistry } from "../../models/FileRegistry";
import { type Logger } from "../../utils";
import type { MinimalSourceFile } from "../../utils/minimalSourceFile";
import { type Token } from "./lexer";

export declare function parseComment(
	tokens: Generator<Token, undefined, undefined>,
	config: CommentParserConfig,
	file: MinimalSourceFile,
	logger: Logger,
	files: FileRegistry,
): Comment;
/**
 * Intended for parsing markdown documents. This only parses code blocks and
 * inline tags outside of code blocks, everything else is text.
 *
 * If you change this, also look at blockContent, as it likely needs similar
 * modifications to ensure parsing is consistent.
 */
export declare function parseCommentString(
	tokens: Generator<Token, undefined, undefined>,
	config: CommentParserConfig,
	file: MinimalSourceFile,
	logger: Logger,
	files: FileRegistry,
): {
	content: CommentDisplayPart[];
	frontmatter: Record<string, unknown>;
};
