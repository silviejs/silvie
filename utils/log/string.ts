const colors = {
	none: '\x1b[0m',
	bright: '\x1b[1m',
	dim: '\x1b[2m',
	underscore: '\x1b[4m',
	blink: '\x1b[5m',
	reverse: '\x1b[7m',
	hidden: '\x1b[8m',

	fg_black: '\x1b[30m',
	fg_red: '\x1b[31m',
	fg_green: '\x1b[32m',
	fg_yellow: '\x1b[33m',
	fg_blue: '\x1b[34m',
	fg_magenta: '\x1b[35m',
	fg_cyan: '\x1b[36m',
	fg_white: '\x1b[37m',

	bg_black: '\x1b[40m',
	bg_red: '\x1b[41m',
	bg_green: '\x1b[42m',
	bg_yellow: '\x1b[43m',
	bg_blue: '\x1b[44m',
	bg_magenta: '\x1b[45m',
	bg_cyan: '\x1b[46m',
	bg_white: '\x1b[47m',
};

export type TColor = 'black' | 'red' | 'green' | 'yellow' | 'blue' | 'magenta' | 'cyan' | 'white';

export default class LogString {
	private readonly str;

	private options: {
		bright?: boolean;
		dim?: boolean;
		underscore?: boolean;
		blink?: boolean;
		reverse?: boolean;
		hidden?: boolean;
		background?: TColor;
		color?: TColor;
	};

	constructor(str?: string) {
		this.str = str || '';
		this.reset();
	}

	color(colorName: TColor): LogString {
		this.options.color = colorName;
		return this;
	}

	defaultColor(): LogString {
		this.options.color = undefined;
		return this;
	}

	background(colorName: TColor): LogString {
		this.options.background = colorName;
		return this;
	}

	defaultBackground(): LogString {
		this.options.background = undefined;
		return this;
	}

	bright(state = true): LogString {
		this.options.bright = state;
		return this;
	}

	dim(state = true): LogString {
		this.options.dim = state;
		return this;
	}

	underscore(state = true): LogString {
		this.options.underscore = state;
		return this;
	}

	blink(state = true): LogString {
		this.options.blink = state;
		return this;
	}

	reverse(state = true): LogString {
		this.options.reverse = state;
		return this;
	}

	hidden(state = true): LogString {
		this.options.hidden = state;
		return this;
	}

	reset(): LogString {
		this.options = {
			bright: false,
			dim: false,
			underscore: false,
			blink: false,
			reverse: false,
			hidden: false,
			background: undefined,
			color: undefined,
		};

		return this;
	}

	getText(): string {
		let output = '';

		if (this.options.bright) {
			output += colors.bright;
		}

		if (this.options.dim) {
			output += colors.dim;
		}

		if (this.options.underscore) {
			output += colors.underscore;
		}

		if (this.options.blink) {
			output += colors.blink;
		}

		if (this.options.reverse) {
			output += colors.reverse;
		}

		if (this.options.hidden) {
			output += colors.hidden;
		}

		if (this.options.background) {
			output += colors[`bg_${this.options.background}`];
		}

		if (this.options.color) {
			output += colors[`fg_${this.options.color}`];
		}

		output += this.str;

		output += colors.none;

		return output;
	}
}
