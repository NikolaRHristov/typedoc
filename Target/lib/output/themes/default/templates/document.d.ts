import type { DocumentReflection } from "../../../../models";
import { JSX } from "../../../../utils";
import type { PageEvent } from "../../../events";
import type { DefaultThemeRenderContext } from "../DefaultThemeRenderContext";
export declare const documentTemplate: ({ markdown }: DefaultThemeRenderContext, props: PageEvent<DocumentReflection>) => JSX.Element;
