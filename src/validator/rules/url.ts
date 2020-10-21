import IValidationRule, { rule } from 'src/validator/rule';
import { isURL } from 'validator';

@rule('url')
export default class URLRule implements IValidationRule {
	validate(value: any): boolean {
		return isURL(value);
	}
}
