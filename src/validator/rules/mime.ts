import IValidationRule, { rule } from 'src/validator/rule';
import { isMimeType } from 'validator';

@rule('mime')
export default class MimeTypeRule implements IValidationRule {
	validate(value: any): boolean {
		return isMimeType(value);
	}
}
