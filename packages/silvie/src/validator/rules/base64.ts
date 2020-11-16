import IValidationRule, { rule } from 'src/validator/rule';
import Validator from 'src/validator';
import { isBase64 } from 'validator';

@rule('base64')
export default class Base64Rule implements IValidationRule {
	validate(validator: Validator, name: string, value: any): boolean {
		return isBase64(value);
	}
}
