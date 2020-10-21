import IValidationRule, { rule } from 'src/validator/rule';
import Validator from 'src/validator';
import { isURL } from 'validator';

@rule('url')
export default class URLRule implements IValidationRule {
	validate(validator: Validator, value: any): boolean {
		return isURL(value);
	}
}
