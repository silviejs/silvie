import IValidationRule, { rule } from 'src/validator/rule';
import { isPostalCode } from 'validator';

@rule('postalCode')
export default class PostalCodeRule implements IValidationRule {
	validate(value: any, locale: string): boolean {
		return isPostalCode(value, locale);
	}
}
