import IValidationRule, { rule } from 'src/validator/rule';
import Validator from 'src/validator';
import { isAlphaNumeric } from 'validator';

@rule('alphanumeric')
export default class AlphaNumericRule implements IValidationRule {
	validate(validator: Validator, value: any): boolean {
		return isAlphaNumeric(value);
	}
}
