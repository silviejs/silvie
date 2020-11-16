import IValidationRule, { rule } from 'src/validator/rule';
import Validator from 'src/validator';
import { isBase32 } from 'validator';

@rule('base32')
export default class Base32Rule implements IValidationRule {
	validate(validator: Validator, name: string, value: any): boolean {
		return isBase32(value);
	}
}
