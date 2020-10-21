import IValidationRule, { rule } from 'src/validator/rule';
import Validator from 'src/validator';
import { isAlpha } from 'validator';

@rule('alpha')
export default class AlphaRule implements IValidationRule {
	validate(validator: Validator, value: any): boolean {
		return isAlpha(value);
	}
}
