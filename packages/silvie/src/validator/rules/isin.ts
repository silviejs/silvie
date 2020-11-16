import IValidationRule, { rule } from 'src/validator/rule';
import Validator from 'src/validator';
import { isISIN } from 'validator';

@rule('isin')
export default class ISINRule implements IValidationRule {
	validate(validator: Validator, name: string, value: any): boolean {
		return isISIN(value);
	}
}
