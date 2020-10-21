import IValidationRule, { rule } from 'src/validator/rule';
import { isAlphaNumeric } from 'validator';

@rule('alphanumeric')
export default class AlphaNumericRule implements IValidationRule {
	validate(value: any): boolean {
		return isAlphaNumeric(value);
	}
}
