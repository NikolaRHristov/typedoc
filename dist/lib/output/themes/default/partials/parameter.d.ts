import { type DeclarationReflection } from "../../../../models";
import { JSX } from "../../../../utils";
import type { DefaultThemeRenderContext } from "../DefaultThemeRenderContext";

export declare const parameter: (
	context: DefaultThemeRenderContext,
	props: DeclarationReflection,
) => JSX.Element;
