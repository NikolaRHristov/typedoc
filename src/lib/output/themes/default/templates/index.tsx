import type { ProjectReflection } from "../../../../models";
import { JSX, Raw } from "../../../../utils";
import type { PageEvent } from "../../../events";
import type { DefaultThemeRenderContext } from "../DefaultThemeRenderContext";

export const indexTemplate = (
	{ markdown }: DefaultThemeRenderContext,
	props: PageEvent<ProjectReflection>,
) => (
	<div class="tsd-panel tsd-typography">
		<Raw html={markdown(props.model.readme || [])} />
	</div>
);
