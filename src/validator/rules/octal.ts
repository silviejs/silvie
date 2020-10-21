import IValidationRule, { rule } from 'src/validator/rule';
import Validator from 'src/validator';
import { isOctal } from 'validator';

@rule('octal')
export default class OctalRule implements IValidationRule {
	validate(validator: Validator, value: any): boolean {
		return isOctal(value);
	}
}
