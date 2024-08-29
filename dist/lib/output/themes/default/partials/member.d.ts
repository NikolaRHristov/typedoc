import {
	type DeclarationReflection,
	type DocumentReflection,
} from "../../../../models";
import { JSX } from "../../../../utils";
import type { DefaultThemeRenderContext } from "../DefaultThemeRenderContext";

export declare function member(
	context: DefaultThemeRenderContext,
	props: DeclarationReflection | DocumentReflection,
): JSX.Element;
