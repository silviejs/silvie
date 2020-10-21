import IValidationRule, { rule } from 'src/validator/rule';
import Validator from 'src/validator';

@rule('array')
export default class ArrayRule implements IValidationRule {
	validate(validator: Validator, value: any): boolean {
		return value instanceof Array;
	}
}
