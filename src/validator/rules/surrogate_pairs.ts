import IValidationRule, { rule } from 'src/validator/rule';
import { isSurrogatePair } from 'validator';

@rule('surrogate')
export default class SurrogatePairRule implements IValidationRule {
	validate(value: any): boolean {
		return isSurrogatePair(value);
	}
}
