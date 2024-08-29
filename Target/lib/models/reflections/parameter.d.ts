import type { SomeType } from "..";
import type { Deserializer, JSONOutput, Serializer } from "../../serialization";
import { Reflection, type TraverseCallback } from "./abstract";
import type { SignatureReflection } from "./signature";
/**
 * @category Reflections
 */
export declare class ParameterReflection extends Reflection {
    readonly variant = "param";
    parent?: SignatureReflection;
    defaultValue?: string;
    type?: SomeType;
    traverse(callback: TraverseCallback): void;
    /**
     * Return a string representation of this reflection.
     */
    toString(): string;
    toObject(serializer: Serializer): JSONOutput.ParameterReflection;
    fromObject(de: Deserializer, obj: JSONOutput.ParameterReflection): void;
}
//# sourceMappingURL=parameter.d.ts.map