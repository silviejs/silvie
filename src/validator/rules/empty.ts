import IValidationRule, { rule } from 'src/validator/rule';
import Validator from 'src/validator';

@rule('empty')
export default class EmptyRule implements IValidationRule {
	validate(validator: Validator, value: any, trim = 'true'): boolean {
		return (trim && ['yes', 'true', '1'].includes(trim) ? `${value}`.trim() : `${value}`).length === 0;
	}
}
