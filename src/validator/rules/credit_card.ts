import IValidationRule, { rule } from 'src/validator/rule';
import { isCreditCard } from 'validator';

@rule('creditCard')
export default class CreditCardRule implements IValidationRule {
	validate(value: any, locale?: string): boolean {
		if (locale === 'fa-IR') {
			return /^[0-9]{16}$/.test(value);
		}

		return isCreditCard(value);
	}
}
