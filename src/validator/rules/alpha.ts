import IValidationRule, { rule } from 'src/validator/rule';
import { isAlpha } from 'validator';

@rule('alpha')
export default class AlphaRule implements IValidationRule {
	validate(value: any): boolean {
		return isAlpha(value);
	}
}
