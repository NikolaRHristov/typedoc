import ts from "typescript";

import { type TranslationProxy } from "../lib/internationalization/internationalization";
import { Logger, LogLevel } from "../lib/utils";

export declare class TestLogger extends Logger {
	messages: string[];
	i18n: TranslationProxy;
	reset(): void;
	expectMessage(message: string): void;
	expectNoMessage(message: string): void;
	expectNoOtherMessages({ ignoreDebug }?: { ignoreDebug: boolean }): void;
	diagnostic(diagnostic: ts.Diagnostic): void;
	log(message: string, level: LogLevel): void;
}
