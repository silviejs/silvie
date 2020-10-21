import IValidationRule, { rule } from 'src/validator/rule';
import { isISO31661Alpha2 } from 'validator';

@rule('iso31661Alpha2')
export default class ISO31661Alpha2Rule implements IValidationRule {
	validate(value: any): boolean {
		return isISO31661Alpha2(value);
	}
}
