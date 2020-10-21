import IValidationRule, { rule } from 'src/validator/rule';
import Validator from 'src/validator';
import { isFullWidth } from 'validator';

@rule('fullWidth')
export default class FullWidthRule implements IValidationRule {
	validate(validator: Validator, value: any): boolean {
		return isFullWidth(value);
	}
}
