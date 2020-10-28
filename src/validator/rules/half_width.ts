import IValidationRule, { rule } from 'src/validator/rule';
import Validator from 'src/validator';
import { isHalfWidth } from 'validator';

@rule('halfWidth')
export default class HalfWidthRule implements IValidationRule {
	validate(validator: Validator, name: string, value: any): boolean {
		return isHalfWidth(value);
	}
}
