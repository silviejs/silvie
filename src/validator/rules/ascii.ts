import IValidationRule, { rule } from 'src/validator/rule';
import { isAscii } from 'validator';

@rule('ascii')
export default class ASCIIRule implements IValidationRule {
	validate(value: any): boolean {
		return isAscii(value);
	}
}
