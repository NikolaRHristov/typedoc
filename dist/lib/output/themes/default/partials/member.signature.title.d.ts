import { type SignatureReflection } from "../../../../models";
import { JSX } from "../../../../utils";
import type { DefaultThemeRenderContext } from "../DefaultThemeRenderContext";

export declare function memberSignatureTitle(
	context: DefaultThemeRenderContext,
	props: SignatureReflection,
	{
		hideName,
		arrowStyle,
		hideParamTypes,
	}?: {
		hideName?: boolean;
		arrowStyle?: boolean;
		hideParamTypes?: boolean;
	},
): JSX.Element;
