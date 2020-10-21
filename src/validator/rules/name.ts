import IValidationRule, { rule } from 'src/validator/rule';
import Validator from 'src/validator';

@rule('name')
export default class NameRule implements IValidationRule {
	validate(validator: Validator, value: any): boolean {
		return /^[^0-9\\/'"[\]{}()_\-=+*&^%$#@!~`,.<>?:;]+$/.test(value);
	}
}
