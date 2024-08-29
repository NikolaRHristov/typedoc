import { AbstractComponent, Component } from "../utils/component";
import type { Converter } from "./converter";

export { Component };
export declare abstract class ConverterComponent extends AbstractComponent<
	Converter,
	{}
> {}
