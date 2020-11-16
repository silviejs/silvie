import IValidationRule, { rule } from 'src/validator/rule';
import Validator from 'src/validator';
import { isHexadecimal } from 'validator';

@rule('hex')
export default class HexadecimalRule implements IValidationRule {
	validate(validator: Validator, name: string, value: any): boolean {
		return isHexadecimal(value);
	}
}
