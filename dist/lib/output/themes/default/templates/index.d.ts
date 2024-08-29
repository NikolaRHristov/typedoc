import type { ProjectReflection } from "../../../../models";
import { JSX } from "../../../../utils";
import type { PageEvent } from "../../../events";
import type { DefaultThemeRenderContext } from "../DefaultThemeRenderContext";

export declare const indexTemplate: (
	{ markdown }: DefaultThemeRenderContext,
	props: PageEvent<ProjectReflection>,
) => JSX.Element;
