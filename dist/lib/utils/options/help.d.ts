import type { TranslationProxy } from "../../internationalization/internationalization";
import type { Options } from "./options";

export interface ParameterHelp {
	names: string[];
	helps: string[];
	margin: number;
}
export declare function getOptionsHelp(
	options: Options,
	i18n: TranslationProxy,
): string;
