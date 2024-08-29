"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parameter = void 0;
const lib_1 = require("../../lib");
const utils_1 = require("../../../../utils");
const models_1 = require("../../../../models");
const parameter = (context, props) =>
	utils_1.JSX.createElement(
		utils_1.JSX.Fragment,
		null,
		utils_1.JSX.createElement(
			"ul",
			{ class: "tsd-parameters" },
			!!props.signatures &&
				utils_1.JSX.createElement(
					"li",
					{ class: "tsd-parameter-signature" },
					utils_1.JSX.createElement(
						"ul",
						{
							class: (0, lib_1.classNames)(
								{ "tsd-signatures": true },
								context.getReflectionClasses(props),
							),
						},
						props.signatures.map((item) =>
							utils_1.JSX.createElement(
								utils_1.JSX.Fragment,
								null,
								utils_1.JSX.createElement(
									"li",
									{ class: "tsd-signature", id: item.anchor },
									context.memberSignatureTitle(item, {
										hideName: true,
									}),
								),
								utils_1.JSX.createElement(
									"li",
									{ class: "tsd-description" },
									context.memberSignatureBody(item, {
										hideSources: true,
									}),
								),
							),
						),
					),
				),
			props.indexSignatures?.map((index) =>
				renderParamIndexSignature(context, index),
			),
			props.children?.map((item) =>
				utils_1.JSX.createElement(
					utils_1.JSX.Fragment,
					null,
					item.signatures
						? utils_1.JSX.createElement(
								"li",
								{ class: "tsd-parameter" },
								utils_1.JSX.createElement(
									"h5",
									null,
									!!item.flags.isRest &&
										utils_1.JSX.createElement(
											"span",
											{ class: "tsd-signature-symbol" },
											"...",
										),
									utils_1.JSX.createElement(
										"span",
										{
											class: (0, lib_1.getKindClass)(
												item,
											),
										},
										(0, lib_1.wbr)(item.name),
									),
									utils_1.JSX.createElement(
										"span",
										{ class: "tsd-signature-symbol" },
										!!item.flags.isOptional && "?",
										":",
									),
									"function",
								),
								context.memberSignatures(item),
							)
						: item.type
							? utils_1.JSX.createElement(
									utils_1.JSX.Fragment,
									null,
									utils_1.JSX.createElement(
										"li",
										{ class: "tsd-parameter" },
										utils_1.JSX.createElement(
											"h5",
											null,
											context.reflectionFlags(item),
											!!item.flags.isRest &&
												utils_1.JSX.createElement(
													"span",
													{
														class: "tsd-signature-symbol",
													},
													"...",
												),
											utils_1.JSX.createElement(
												"span",
												{
													class: (0,
													lib_1.getKindClass)(item),
												},
												(0, lib_1.wbr)(item.name),
											),
											utils_1.JSX.createElement(
												"span",
												{
													class: "tsd-signature-symbol",
												},
												!!item.flags.isOptional && "?",
												": ",
											),
											context.type(item.type),
										),
										context.commentSummary(item),
										context.commentTags(item),
										!!item.children &&
											context.parameter(item),
										item.type instanceof
											models_1.ReflectionType &&
											context.parameter(
												item.type.declaration,
											),
									),
								)
							: utils_1.JSX.createElement(
									utils_1.JSX.Fragment,
									null,
									item.getSignature &&
										utils_1.JSX.createElement(
											utils_1.JSX.Fragment,
											null,
											utils_1.JSX.createElement(
												"li",
												{ class: "tsd-parameter" },
												utils_1.JSX.createElement(
													"h5",
													null,
													context.reflectionFlags(
														item.getSignature,
													),
													utils_1.JSX.createElement(
														"span",
														{
															class: "tsd-signature-keyword",
														},
														"get ",
													),
													utils_1.JSX.createElement(
														"span",
														{
															class: (0,
															lib_1.getKindClass)(
																item,
															),
														},
														(0, lib_1.wbr)(
															item.name,
														),
													),
													utils_1.JSX.createElement(
														"span",
														{
															class: "tsd-signature-symbol",
														},
														"(): ",
													),
													context.type(
														item.getSignature.type,
													),
												),
												context.commentSummary(
													item.getSignature,
												),
												context.commentTags(
													item.getSignature,
												),
											),
										),
									item.setSignature &&
										utils_1.JSX.createElement(
											utils_1.JSX.Fragment,
											null,
											utils_1.JSX.createElement(
												"li",
												{ class: "tsd-parameter" },
												utils_1.JSX.createElement(
													"h5",
													null,
													context.reflectionFlags(
														item.setSignature,
													),
													utils_1.JSX.createElement(
														"span",
														{
															class: "tsd-signature-keyword",
														},
														"set ",
													),
													utils_1.JSX.createElement(
														"span",
														{
															class: (0,
															lib_1.getKindClass)(
																item,
															),
														},
														(0, lib_1.wbr)(
															item.name,
														),
													),
													utils_1.JSX.createElement(
														"span",
														{
															class: "tsd-signature-symbol",
														},
														"(",
													),
													item.setSignature.parameters?.map(
														(item) =>
															utils_1.JSX.createElement(
																utils_1.JSX
																	.Fragment,
																null,
																item.name,
																utils_1.JSX.createElement(
																	"span",
																	{
																		class: "tsd-signature-symbol",
																	},
																	": ",
																),
																context.type(
																	item.type,
																),
															),
													),
													utils_1.JSX.createElement(
														"span",
														{
															class: "tsd-signature-symbol",
														},
														"): ",
													),
													context.type(
														item.setSignature.type,
													),
												),
												context.commentSummary(
													item.setSignature,
												),
												context.commentTags(
													item.setSignature,
												),
											),
										),
								),
				),
			),
		),
	);
exports.parameter = parameter;
function renderParamIndexSignature(context, index) {
	return utils_1.JSX.createElement(
		"li",
		{ class: "tsd-parameter-index-signature" },
		utils_1.JSX.createElement(
			"h5",
			null,
			utils_1.JSX.createElement(
				"span",
				{ class: "tsd-signature-symbol" },
				"[",
			),
			index.parameters.map((item) =>
				utils_1.JSX.createElement(
					utils_1.JSX.Fragment,
					null,
					utils_1.JSX.createElement(
						"span",
						{ class: (0, lib_1.getKindClass)(item) },
						item.name,
					),
					": ",
					context.type(item.type),
				),
			),
			utils_1.JSX.createElement(
				"span",
				{ class: "tsd-signature-symbol" },
				"]: ",
			),
			context.type(index.type),
		),
		context.commentSummary(index),
		context.commentTags(index),
		index.type instanceof models_1.ReflectionType &&
			context.parameter(index.type.declaration),
	);
}
