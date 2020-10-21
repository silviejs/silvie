import IValidationRule, { rule } from 'src/validator/rule';
import { isLowercase } from 'validator';

@rule('lowercase')
export default class LowercaseRule implements IValidationRule {
	validate(value: any): boolean {
		return isLowercase(value);
	}
}
