import IValidationRule, { rule } from 'src/validator/rule';
import { isHalfWidth } from 'validator';

@rule('halfWidth')
export default class HalfWidthRule implements IValidationRule {
	validate(value: any): boolean {
		return isHalfWidth(value);
	}
}
