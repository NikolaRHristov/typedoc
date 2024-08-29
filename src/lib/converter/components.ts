import { AbstractComponent, Component } from "../utils/component";
import type { Converter } from "./converter";

export { Component };

export abstract class ConverterComponent extends AbstractComponent<
	Converter,
	{}
> {}
