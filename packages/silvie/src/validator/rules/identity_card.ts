import IValidationRule, { rule } from 'src/validator/rule';
import Validator from 'src/validator';
import { isIdentityCard } from 'validator';

@rule('identityCard')
export default class IdentityCardRule implements IValidationRule {
	validate(validator: Validator, name: string, value: any, locale: string): boolean {
		if (locale === 'fa_IR') {
			if (!/^\d{10}$/.test(value)) {
				return false;
			}

			const code = value.split('').reverse().join('');

			let sum = 0;
			for (let i = 1; i < code.length; i++) sum += parseInt(code[i], 10) * (i + 1);

			const r = sum % 11;
			const c = parseInt(code[0], 10);

			return r < 2 ? c === r : c === 11 - r;
		}

		return isIdentityCard(value, locale);
	}
}
