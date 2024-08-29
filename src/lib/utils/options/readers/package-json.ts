import { ok } from "assert";
import { dirname } from "path";

import type { OptionsReader } from "..";
import type { TranslatedString } from "../../../internationalization/internationalization";
import { discoverPackageJson } from "../../fs";
import type { Logger } from "../../loggers";
import { nicePath } from "../../paths";
import type { Options } from "../options";

export class PackageJsonReader implements OptionsReader {
	// Should run after the TypeDoc config reader but before the TS config
	// reader, so that it can still specify a path to a `tsconfig.json` file.
	order = 150;

	supportsPackages = true;

	name = "package-json";

	read(container: Options, logger: Logger, cwd: string): void {
		const result = discoverPackageJson(cwd);

		if (!result) {
			return;
		}

		const { file, content } = result;

		if ("typedoc" in content) {
			logger.warn(logger.i18n.typedoc_key_in_0_ignored(nicePath(file)));
		}

		const optsKey = "typedocOptions";
		if (!(optsKey in content)) {
			return;
		}

		const opts = content[optsKey];
		if (opts === null || typeof opts !== "object") {
			logger.error(
				logger.i18n.typedoc_options_must_be_object_in_0(nicePath(file)),
			);
			return;
		}

		for (const [opt, val] of Object.entries(opts)) {
			try {
				container.setValue(opt as never, val as never, dirname(file));
			} catch (err) {
				ok(err instanceof Error);
				logger.error(err.message as TranslatedString);
			}
		}
	}
}
