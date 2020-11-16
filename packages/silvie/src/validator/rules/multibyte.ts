import IValidationRule, { rule } from 'src/validator/rule';
import Validator from 'src/validator';
import { isMultibyte } from 'validator';

@rule('multibyte')
export default class MultibyteRule implements IValidationRule {
	validate(validator: Validator, name: string, value: any): boolean {
		return isMultibyte(value);
	}
}
