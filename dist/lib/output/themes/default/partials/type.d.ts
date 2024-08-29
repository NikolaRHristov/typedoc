import { type Type } from "../../../../models";
import { JSX } from "../../../../utils";
import type { DefaultThemeRenderContext } from "../DefaultThemeRenderContext";

export declare function validateStateIsClean(page: string): void;
export declare function type(
	context: DefaultThemeRenderContext,
	type: Type | undefined,
	options?: {
		topLevelLinks: boolean;
	},
): JSX.Element;
