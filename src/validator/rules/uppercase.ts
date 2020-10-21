import IValidationRule, { rule } from 'src/validator/rule';
import { isUppercase } from 'validator';

@rule('uppercase')
export default class UppercaseRule implements IValidationRule {
	validate(value: any): boolean {
		return isUppercase(value);
	}
}
