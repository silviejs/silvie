import { validationRules } from 'base/validator/rule';

export type TRuleHandler = (value: any, ...params: any[]) => boolean;

export type TRule = {
	name: string;
	handler: TRuleHandler;
	params: any[];
};

export default class Validator {
	data: Record<string, any>;

	rules: Record<string, TRule[]>;

	messages: Record<string, string>;

	errors: any;

	private static parseRules(rules: Record<string, string>) {
		const parsedRules = {};

		// Iterate over rule keys
		Object.keys(rules).forEach((key: string) => {
			// Create an empty array for that key
			parsedRules[key] = [];

			// Split the rules with '|'
			rules[key].split('|').forEach((ruleStr) => {
				// Get rule name and parameters by splitting with ':'
				const [name, paramsStr] = ruleStr.split(':');

				// Get rule handler
				const handler = validationRules[name];

				// If there is no handler throw an error
				if (!handler) {
					throw new Error(`Validation rule '${name}' not exists.`);
				}

				// Get parameters by splitting them with ','
				const params = paramsStr ? paramsStr.split(',').map((param) => param.trim()) : [];

				// Add the rule to the array
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
		// Iterate over all path parts
		for (let index = 0; index < path.length; index++) {
			const part = path[index];

			// If the current part is a wildcard
			if (part === '*') {
				// And it is the last part
				if (index === path.length - 1) {
					// Return an array of all items in the current path
					return Object.keys(data).map((key) => {
						return { path: traversed.concat(key), value: data[key] };
					});
				}

				// If it is not the last part,
				// run this function on all items in the current path,
				// and return a flattened array of its results
				return Object.keys(data)
					.map((key) => {
						return Validator.findData(data[key], path.slice(index + 1), traversed.concat(key));
					})
					.flat();
			}

			// If this path part is in the current data section
			if (part in data) {
				// Get its value
				const value = data[part];

				// If it is the last part, return the found value
				if (index === path.length - 1) {
					return [{ path: traversed.concat(part), value }];
				}

				// If it is not the last part, run the function in on the found value
				return Validator.findData(value, path.slice(index + 1), path.slice(0, index + 1));
			}
		}

		// Return an empty array, if none of above worked
		return [];
	}

	validate(): void {
		Object.keys(this.rules).forEach((fieldName) => {
			const rules = this.rules[fieldName];
			const results = Validator.findData(this.data, fieldName.split('.'));

			// Iterate over found data
			for (let resultIndex = 0; resultIndex < results.length; resultIndex++) {
				// Get exact path and value of that item
				const { path, value } = results[resultIndex];

				// Iterate over matching rules
				for (let ruleIndex = 0; ruleIndex < rules.length; ruleIndex++) {
					const rule = rules[ruleIndex];

					// Run the rule handler
					const validationResult = rule.handler(value, ...rule.params);

					// If it is undefined, Break with no errors
					if (validationResult === undefined) {
						break;
					}

					// If it is not true, Error message
					if (validationResult !== true) {
						console.log('-', path.join('.'), rule.name);
					}

					// If it is null, Break after error
					if (validationResult === null) {
						break;
					}
				}
			}
		});
	}

	constructor(data: Record<string, any>, rules: Record<string, string>, messages?: Record<string, string>) {
		this.data = data;
		this.rules = Validator.parseRules(rules);
		this.messages = messages;

		this.validate();
	}
}
