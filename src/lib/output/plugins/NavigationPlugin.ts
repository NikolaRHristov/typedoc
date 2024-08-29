import * as Path from "path";
import { promisify } from "util";
import { gzip } from "zlib";

import { writeFile } from "../../utils";
import { Component, RendererComponent } from "../components";
import { RendererEvent } from "../events";
import { DefaultTheme } from "../themes/default/DefaultTheme";

const gzipP = promisify(gzip);

@Component({ name: "navigation-tree" })
export class NavigationPlugin extends RendererComponent {
	override initialize() {
		this.owner.on(RendererEvent.BEGIN, this.onRendererBegin.bind(this));
	}

	private onRendererBegin(_event: RendererEvent) {
		if (!(this.owner.theme instanceof DefaultTheme)) {
			return;
		}
		this.owner.preRenderAsyncJobs.push((event) =>
			this.buildNavigationIndex(event),
		);
	}

	private async buildNavigationIndex(event: RendererEvent) {
		const navigationJs = Path.join(
			event.outputDirectory,
			"assets",
			"navigation.js",
		);

		const nav = (this.owner.theme as DefaultTheme).getNavigation(
			event.project,
		);
		const gz = await gzipP(Buffer.from(JSON.stringify(nav)));

		await writeFile(
			navigationJs,
			`window.navigationData = "data:application/octet-stream;base64,${gz.toString(
				"base64",
			)}"`,
		);
	}
}
