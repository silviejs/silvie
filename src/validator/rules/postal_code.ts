import IValidationRule, { rule } from 'src/validator/rule';
import Validator from 'src/validator';
import { isPostalCode } from 'validator';

@rule('postalCode')
export default class PostalCodeRule implements IValidationRule {
	validate(validator: Validator, value: any, locale: string): boolean {
		return isPostalCode(value, locale);
	}
}
