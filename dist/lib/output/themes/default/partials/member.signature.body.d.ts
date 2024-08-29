import { type SignatureReflection } from "../../../../models";
import { JSX } from "../../../../utils";
import type { DefaultThemeRenderContext } from "../DefaultThemeRenderContext";

export declare function memberSignatureBody(
	context: DefaultThemeRenderContext,
	props: SignatureReflection,
	{
		hideSources,
	}?: {
		hideSources?: boolean;
	},
): JSX.Element;
