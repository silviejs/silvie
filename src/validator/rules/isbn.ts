import IValidationRule, { rule } from 'src/validator/rule';
import { isISBN } from 'validator';

@rule('isbn')
export default class ISBNRule implements IValidationRule {
	validate(value: any, version = '10'): boolean {
		return isISBN(value, version);
	}
}
