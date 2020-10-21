import IValidationRule, { rule } from 'src/validator/rule';
import { isBase64 } from 'validator';

@rule('base64')
export default class Base64Rule implements IValidationRule {
	validate(value: any): boolean {
		return isBase64(value);
	}
}
