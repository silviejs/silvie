import IValidationRule, { rule } from 'src/validator/rule';
import { isDecimal } from 'validator';

@rule('decimal')
export default class DecimalRule implements IValidationRule {
	validate(value: any, locale = 'en-US'): boolean {
		return isDecimal(value, { locale });
	}
}
