import { Logger } from "./logger";

export class Calculator {
	add(a: number, b: number): ArithmeticResult {
		return new ArithmeticResult(a + b);
	}

	subtract(a: number, b: number): ArithmeticResult {
		return new ArithmeticResult(a - b);
	}
}

export class ArithmeticResult {
	private val: number;
	private logger = new Logger();

	constructor(result: number) {
		this.val = result;
	}

	print() {
		this.logger.success(`The answer is ${this.val}!`);
	}

	get value() {
		return this.val;
	}
}
