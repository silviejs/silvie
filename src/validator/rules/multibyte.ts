import IValidationRule, { rule } from 'src/validator/rule';
import { isMultibyte } from 'validator';

@rule('multibyte')
export default class MultibyteRule implements IValidationRule {
	validate(value: any): boolean {
		return isMultibyte(value);
	}
}
