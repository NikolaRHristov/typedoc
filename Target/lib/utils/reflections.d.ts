import { Reflection, type ProjectReflection, type ReferenceType } from "../models";
export declare function discoverAllReferenceTypes(project: ProjectReflection, forExportValidation: boolean): {
    type: ReferenceType;
    owner: Reflection;
}[];
