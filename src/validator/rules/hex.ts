import IValidationRule, { rule } from 'src/validator/rule';
import { isHexadecimal } from 'validator';

@rule('hex')
export default class HexadecimalRule implements IValidationRule {
	validate(value: any): boolean {
		return isHexadecimal(value);
	}
}
