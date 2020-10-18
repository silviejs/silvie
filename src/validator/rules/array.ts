import IValidationRule, { rule } from 'src/validator/rule';

@rule('array')
export default class ArrayRule implements IValidationRule {
	validate(value: any): boolean {
		return value instanceof Array;
	}
}
