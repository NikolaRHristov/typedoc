import type { DocumentReflection } from "../../../../models";
import { JSX, Raw } from "../../../../utils";
import type { PageEvent } from "../../../events";
import type { DefaultThemeRenderContext } from "../DefaultThemeRenderContext";

export const documentTemplate = (
	{ markdown }: DefaultThemeRenderContext,
	props: PageEvent<DocumentReflection>,
) => (
	<div class="tsd-panel tsd-typography">
		<Raw html={markdown(props.model.content)} />
	</div>
);
