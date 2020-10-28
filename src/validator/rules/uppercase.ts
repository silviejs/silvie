import IValidationRule, { rule } from 'src/validator/rule';
import Validator from 'src/validator';
import { isUppercase } from 'validator';

@rule('uppercase')
export default class UppercaseRule implements IValidationRule {
	validate(validator: Validator, name: string, value: any): boolean {
		return isUppercase(value);
	}
}
