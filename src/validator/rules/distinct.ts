import IValidationRule, { rule } from 'src/validator/rule';

@rule('distinct')
export default class DistinctRule implements IValidationRule {
	validate(value: Array<any>): boolean {
		if (value instanceof Array) {
			return value.length === new Set(value).size;
		}

		return false;
	}
}
