import IValidationRule, { rule } from 'src/validator/rule';
import { isISO31661Alpha3 } from 'validator';

@rule('iso31661Alpha3')
export default class ISO31661Alpha3Rule implements IValidationRule {
	validate(value: any): boolean {
		return isISO31661Alpha3(value);
	}
}
