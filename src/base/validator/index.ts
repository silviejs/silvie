import { validationRules } from 'base/validator/rule';

export default class Validator {
	data: any;

	rules: any;

	errors: any;

	private static parseRules(rules) {
		const parsedRules = {};

		Object.keys(rules).forEach((key: string) => {
			parsedRules[key] = [];

			rules[key].split('|').forEach((ruleStr) => {
				const [name, paramsStr] = ruleStr.split(':');
				const rule = validationRules[name];

				if (!rule) {
					throw new Error(`Validation rule '${name}' not exists.`);
				}

				const params = (paramsStr || '').split(',').map((param) => param.trim());

				parsedRules[key].push({
					name,
					rule,
					params,
				});
			});
		});

		return parsedRules;
	}

	validate(): void {
		//
	}

	constructor(data, rules) {
		this.data = data;
		this.rules = Validator.parseRules(rules);

		this.validate();
	}
}
