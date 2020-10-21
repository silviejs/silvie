import IValidationRule, { rule } from 'src/validator/rule';
import Validator from 'src/validator';
import { isHexColor } from 'validator';

@rule('hexColor')
export default class HexColorRule implements IValidationRule {
	validate(validator: Validator, value: any): boolean {
		return isHexColor(value);
	}
}
