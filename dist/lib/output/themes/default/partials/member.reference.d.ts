import type { ReferenceReflection } from "../../../../models";
import { JSX } from "../../../../utils";
import type { DefaultThemeRenderContext } from "../DefaultThemeRenderContext";

export declare const memberReference: (
	{ urlTo, i18n, commentSummary, commentTags }: DefaultThemeRenderContext,
	props: ReferenceReflection,
) => JSX.Element;
