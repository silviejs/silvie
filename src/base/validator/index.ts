export default class Validator {
	data: any;

	rules: any;

	private static parseRules(rules) {
		// Parse rule strings

		return rules;
	}

	constructor(data, rules) {
		this.data = data;
		this.rules = Validator.parseRules(rules);

		// Validate
	}
}
