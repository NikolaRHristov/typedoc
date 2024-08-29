import {
	DeclarationReflection,
	Reflection,
	ReflectionKind,
	type ProjectReflection,
	type SignatureReflection,
} from "..";

export declare function query(
	project: ProjectReflection,
	name: string,
): DeclarationReflection;
export declare function querySig(
	project: ProjectReflection,
	name: string,
	index?: number,
): SignatureReflection;
export declare function getComment(
	project: ProjectReflection,
	name: string,
): string;
export declare function getSigComment(
	project: ProjectReflection,
	name: string,
	index?: number,
): string;
export declare function getLinks(refl: Reflection): Array<{
	display: string;
	target: undefined | string | [ReflectionKind, string];
}>;
export declare function equalKind(refl: Reflection, kind: ReflectionKind): void;
