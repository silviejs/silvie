import IValidationRule, { rule } from 'src/validator/rule';
import Validator from 'src/validator';
import { isDecimal } from 'validator';

@rule('decimal')
export default class DecimalRule implements IValidationRule {
	validate(validator: Validator, name: string, value: any, locale = 'en-US'): boolean {
		return isDecimal(value, { locale });
	}
}
