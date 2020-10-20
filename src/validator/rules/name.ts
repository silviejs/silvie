import IValidationRule, { rule } from 'src/validator/rule';

@rule('name')
export default class NameRule implements IValidationRule {
	validate(value: any): boolean {
		return /^[^0-9\\/'"[\]{}()_\-=+*&^%$#@!~`,.<>?:;]+$/.test(value);
	}
}