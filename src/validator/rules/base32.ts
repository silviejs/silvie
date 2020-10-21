import IValidationRule, { rule } from 'src/validator/rule';
import { isBase32 } from 'validator';

@rule('base32')
export default class Base32Rule implements IValidationRule {
	validate(value: any): boolean {
		return isBase32(value);
	}
}
