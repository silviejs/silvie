import { validationRules } from 'src/validator/rule';
import validationMessages from 'src/validator/messages';

export type TRuleHandler = (value: any, ...params: any[]) => boolean;
export type TRuleMessenger = (result: any) => string | [];

export type TRule = {
	name: string;
	handler: TRuleHandler;
	messenger?: TRuleMessenger;
	params: any[];
};

export default class Validator {
	data: Record<string, any> | any[];

	rules: Record<string, TRule[]>;

	messages: Record<string, string | string[]>;

	errors: Record<string, any>;

	hasErrors = false;

	generateNestedErrors = true;

	static findData(data: any, path: string[], traversed: string[] = []): { path: string[]; value: any }[] {
		// Iterate over all path parts
		for (let index = 0; index < path.length; index++) {
			const part = path[index];

			// If the current part is a wildcard
			if (data !== undefined && data !== null && part === '*') {
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
			if (data !== undefined && data !== null && part in data) {
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

	private static parseRules(rules: Record<string, string>): Record<string, TRule[]> {
		const parsedRules: Record<string, TRule[]> = {};

		// Iterate over rule keys
		Object.keys(rules).forEach((key: string) => {
			// Create an empty array for that key
			parsedRules[key] = [];

			// Split the rules with '|'
			rules[key].split('|').forEach((ruleStr) => {
				// Get rule name and parameters by splitting with ':'
				const [name, ...restParams] = ruleStr.split(':', 1);
				const paramsStr = restParams.join(':');

				// Get rule
				const rule = validationRules[name];

				// If there is no rule throw an error
				if (!rule) {
					throw new Error(`Validation rule '${name}' not exists.`);
				}

				// Get parameters by splitting them with ','
				const params = paramsStr ? paramsStr.split(',').map((param) => param.trim()) : [];

				// Add the rule to the array
				parsedRules[key].push({
					name,
					handler: rule.validate,
					messenger: rule.messenger,
					params,
				});
			});
		});

		return parsedRules;
	}

	private placeErrorMessage(path: string[], messages: string[]): void {
		let current = this.errors;
		path.forEach((part, index) => {
			if (index < path.length - 1) {
				if (!(part in current)) {
					current[part] = {};
				}

				current = current[part];
			} else {
				current[part] = messages;
			}
		});
	}

	private executeRules(fieldName, exactPath, value, rules) {
		const messages = [];

		// Iterate over matching rules
		for (let ruleIndex = 0; ruleIndex < rules.length; ruleIndex++) {
			const rule = rules[ruleIndex];

			// Run the rule handler
			const validationResult = rule.handler(this, exactPath, value, ...rule.params);

			// If it is undefined, Break with no errors
			if (validationResult === undefined) {
				break;
			}

			// If it is not true, Error message
			if (validationResult !== true) {
				// Find raw error message
				const rawMessage =
					(rule.messenger && rule.messenger(validationResult)) ||
					this.messages[`${exactPath}:${rule.name}`] ||
					this.messages[`${fieldName}:${rule.name}`] ||
					validationMessages[rule.name];

				if (rawMessage) {
					const rawMessages = [];

					// Replace placeholders
					if (typeof rawMessage === 'string') {
						rawMessages.push(rawMessage);
					} else if (rawMessage instanceof Array) {
						rawMessages.push(...rawMessage);
					}

					rawMessages.forEach((msg) => {
						const message = msg
							.replace(/:path/g, exactPath)
							.replace(/:field/g, fieldName)
							.replace(/:name/g, exactPath.split('.').pop())
							.replace(/:params/g, rule.params.join(', '))
							.replace(/:(\d+)/g, (match, param) => rule.params[param] || '');

						messages.push(message);
					});
				} else {
					throw new Error(`Could not find a message for '${rule.name}' at '${exactPath}'`);
				}
			}

			// If it is null, Break after error
			if (validationResult === null) {
				break;
			}
		}

		return messages;
	}

	validate(): void {
		this.errors = {};
		this.hasErrors = false;

		Object.keys(this.rules).forEach((fieldName) => {
			const rules = this.rules[fieldName];
			const pathParts = fieldName.split('.');
			const results = Validator.findData(this.data, pathParts);

			if (results.length === 0) {
				results.push({ path: pathParts, value: undefined });
			}

			// Iterate over found data
			for (let resultIndex = 0; resultIndex < results.length; resultIndex++) {
				// Get exact path and value of that item
				const { path, value } = results[resultIndex];
				const exactPath = path.join('.');

				const messages = this.executeRules(fieldName, exactPath, value, rules);

				if (messages.length > 0) {
					if (!this.hasErrors) {
						this.hasErrors = true;
					}

					if (this.generateNestedErrors) {
						this.placeErrorMessage(path, messages);
					} else {
						this.errors[exactPath] = messages;
					}
				}
			}
		});
	}

	constructor(
		data: Record<string, any> | any[],
		rules: Record<string, string>,
		messages?: Record<string, string | string[]>,
		generateNestedErrors = true
	) {
		this.data = data;
		this.rules = Validator.parseRules(rules);
		this.messages = messages || {};
		this.errors = {};
		this.generateNestedErrors = generateNestedErrors;

		this.validate();
	}
}
