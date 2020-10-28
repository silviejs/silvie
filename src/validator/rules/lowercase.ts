import IValidationRule, { rule } from 'src/validator/rule';
import Validator from 'src/validator';
import { isLowercase } from 'validator';

@rule('lowercase')
export default class LowercaseRule implements IValidationRule {
	validate(validator: Validator, name: string, value: any): boolean {
		return isLowercase(value);
	}
}
