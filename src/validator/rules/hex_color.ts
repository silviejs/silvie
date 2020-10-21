import IValidationRule, { rule } from 'src/validator/rule';
import { isHexColor } from 'validator';

@rule('hexColor')
export default class HexColorRule implements IValidationRule {
	validate(value: any): boolean {
		return isHexColor(value);
	}
}
