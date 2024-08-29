import type { Logger } from "../../loggers";
import type { Options, OptionsReader } from "../options";
export declare class TSConfigReader implements OptionsReader {
    /**
     * Note: Runs after the {@link TypeDocReader}.
     */
    order: number;
    name: string;
    supportsPackages: boolean;
    private seenTsdocPaths;
    read(container: Options, logger: Logger, cwd: string): void;
    private addTagsFromTsdocJson;
    private readTsDoc;
}
//# sourceMappingURL=tsconfig.d.ts.map