import IValidationRule, { rule } from 'src/validator/rule';
import { isInt } from 'validator';

@rule('int')
export default class IntRule implements IValidationRule {
	validate(value: any): boolean {
		return isInt(value);
	}
}
