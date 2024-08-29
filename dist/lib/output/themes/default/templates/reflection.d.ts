import { type ContainerReflection } from "../../../../models";
import { JSX } from "../../../../utils";
import type { PageEvent } from "../../../events";
import type { DefaultThemeRenderContext } from "../DefaultThemeRenderContext";

export declare function reflectionTemplate(
	context: DefaultThemeRenderContext,
	props: PageEvent<ContainerReflection>,
): JSX.Element;
