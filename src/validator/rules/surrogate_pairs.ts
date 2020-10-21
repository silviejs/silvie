import IValidationRule, { rule } from 'src/validator/rule';
import Validator from 'src/validator';
import { isSurrogatePair } from 'validator';

@rule('surrogate')
export default class SurrogatePairRule implements IValidationRule {
	validate(validator: Validator, value: any): boolean {
		return isSurrogatePair(value);
	}
}
