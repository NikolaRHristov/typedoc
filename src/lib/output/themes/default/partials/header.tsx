import { ReflectionKind, type Reflection } from "../../../../models";
import { JSX } from "../../../../utils";
import type { PageEvent } from "../../../events";
import { classNames, getDisplayName, hasTypeParameters, join } from "../../lib";
import type { DefaultThemeRenderContext } from "../DefaultThemeRenderContext";

export const header = (
	context: DefaultThemeRenderContext,
	props: PageEvent<Reflection>,
) => {
	const HeadingLevel = props.model.isProject() ? "h2" : "h1";
	return (
		<div class="tsd-page-title">
			{!!props.model.parent && (
				<ul class="tsd-breadcrumb">
					{context.breadcrumb(props.model)}
				</ul>
			)}
			{!props.model.isDocument() && (
				<HeadingLevel
					class={classNames({
						deprecated: props.model.isDeprecated(),
					})}>
					{props.model.kind !== ReflectionKind.Project &&
						`${context.internationalization.kindSingularString(props.model.kind)} `}
					{getDisplayName(props.model)}
					{hasTypeParameters(props.model) && (
						<>
							{"<"}
							{join(
								", ",
								props.model.typeParameters,
								(item) => item.name,
							)}
							{">"}
						</>
					)}
					{context.reflectionFlags(props.model)}
				</HeadingLevel>
			)}
		</div>
	);
};
