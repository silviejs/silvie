import IValidationRule, { rule } from 'src/validator/rule';

@rule('equals')
export default class EqualsRule implements IValidationRule {
	validate(value: any, key: string): boolean {
		if (typeof value === 'object') {
			return JSON.stringify(value) === JSON.stringify(key);
		}

		if (typeof value === 'boolean') {
			return value === !!key;
		}

		if (typeof value === 'number') {
			if (value === Math.floor(value)) {
				return value === parseInt(key, 10);
			}

			return value === parseFloat(key);
		}

		if (typeof value === 'string') {
			return value === key;
		}

		// eslint-disable-next-line eqeqeq
		return value == key;
	}
}
