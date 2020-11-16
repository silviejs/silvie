import IValidationRule, { rule } from 'src/validator/rule';
import Validator from 'src/validator';
import { isDate } from 'validator';

@rule('date')
export default class DateRule implements IValidationRule {
	validate(validator: Validator, name: string, value: any, format?: string): boolean {
		return isDate(value, format);
	}
}
