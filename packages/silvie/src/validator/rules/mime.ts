import IValidationRule, { rule } from 'src/validator/rule';
import Validator from 'src/validator';
import { isMimeType } from 'validator';

@rule('mime')
export default class MimeTypeRule implements IValidationRule {
	validate(validator: Validator, name: string, value: any): boolean {
		return isMimeType(value);
	}
}
