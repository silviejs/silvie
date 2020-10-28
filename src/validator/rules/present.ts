import IValidationRule, { rule } from 'src/validator/rule';
import Validator from 'src/validator';

@rule('present')
export default class PresentRule implements IValidationRule {
	validate(validator: Validator, name: string, value: any): boolean {
		return value !== undefined || null;
	}
}
