import IValidationRule, { rule } from 'src/validator/rule';
import { isMobilePhone } from 'validator';

@rule('phone')
export default class PhoneRule implements IValidationRule {
	validate(value: any, locale: string): boolean {
		if (locale === 'fa_IR') {
			return /^(?:98|\+98|0098|0)?9[0-9]{9}$/.test(value);
		}
		return isMobilePhone(value, locale);
	}
}
