import IValidationRule, { rule } from 'src/validator/rule';
import { isOctal } from 'validator';

@rule('octal')
export default class OctalRule implements IValidationRule {
	validate(value: any): boolean {
		return isOctal(value);
	}
}
