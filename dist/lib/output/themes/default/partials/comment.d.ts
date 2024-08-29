import { type Reflection } from "../../../../models";
import { JSX } from "../../../../utils";
import type { DefaultThemeRenderContext } from "../DefaultThemeRenderContext";

export declare function commentSummary(
	{ markdown }: DefaultThemeRenderContext,
	props: Reflection,
): JSX.Element | undefined;
export declare function commentTags(
	context: DefaultThemeRenderContext,
	props: Reflection,
): JSX.Element | undefined;
export declare function reflectionFlags(
	context: DefaultThemeRenderContext,
	props: Reflection,
): JSX.Element;
