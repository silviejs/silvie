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
				const handler = validationRules[name];

				if (!handler) {
					throw new Error(`Validation rule '${name}' not exists.`);
				}

				const params = (paramsStr || '').split(',').map((param) => param.trim());

				parsedRules[key].push({
					name,
					handler,
					params,
				});
			});
		});

		return parsedRules;
	}

	private static findData(data: any, path: string[], traversed: string[] = []) {
		const partCount = path.length;

		for (let index = 0; index < partCount; index++) {
			const part = path[index];

			if (part === '*') {
				if (index === partCount - 1) {
					return Object.keys(data).map((key) => {
						return { path: traversed.concat(key), value: data[key] };
					});
				}

				return Object.keys(data)
					.map((key) => {
						return Validator.findData(data[key], path.slice(index + 1), traversed.concat(key));
					})
					.flat();
			}

			if (part in data) {
				const value = data[part];

				if (index === partCount - 1) {
					return [{ path: traversed.concat(part), value }];
				}

				return Validator.findData(value, path.slice(index + 1), path.slice(0, index + 1));
			}
		}

		return [];
	}

	validate(): void {
		Object.keys(this.rules).forEach((fieldName) => {
			const result = Validator.findData(this.data, fieldName.split('.'));
			console.log(fieldName, result);
		});
	}

	constructor(data, rules) {
		this.data = data;
		this.rules = Validator.parseRules(rules);

		this.validate();
	}
}
