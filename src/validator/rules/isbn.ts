import IValidationRule, { rule } from 'src/validator/rule';
import Validator from 'src/validator';
import { isISBN } from 'validator';

@rule('isbn')
export default class ISBNRule implements IValidationRule {
	validate(validator: Validator, name: string, value: any, version = '10'): boolean {
		return isISBN(value, version);
	}
}
