import { ReflectionKind, type ProjectReflection } from "../models";
import type { Logger } from "../utils";
export declare function validateDocumentation(project: ProjectReflection, logger: Logger, requiredToBeDocumented: readonly ReflectionKind.KindString[]): void;
