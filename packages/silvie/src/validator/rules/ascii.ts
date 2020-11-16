import IValidationRule, { rule } from 'src/validator/rule';
import Validator from 'src/validator';
import { isAscii } from 'validator';

@rule('ascii')
export default class ASCIIRule implements IValidationRule {
	validate(validator: Validator, name: string, value: any): boolean {
		return isAscii(value);
	}
}
