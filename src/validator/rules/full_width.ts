import IValidationRule, { rule } from 'src/validator/rule';
import { isFullWidth } from 'validator';

@rule('fullWidth')
export default class FullWidthRule implements IValidationRule {
	validate(value: any): boolean {
		return isFullWidth(value);
	}
}
