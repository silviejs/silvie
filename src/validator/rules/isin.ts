import IValidationRule, { rule } from 'src/validator/rule';
import { isISIN } from 'validator';

@rule('isin')
export default class ISINRule implements IValidationRule {
	validate(value: any): boolean {
		return isISIN(value);
	}
}
