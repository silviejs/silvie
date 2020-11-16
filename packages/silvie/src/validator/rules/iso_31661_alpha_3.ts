import IValidationRule, { rule } from 'src/validator/rule';
import Validator from 'src/validator';
import { isISO31661Alpha3 } from 'validator';

@rule('iso31661Alpha3')
export default class ISO31661Alpha3Rule implements IValidationRule {
	validate(validator: Validator, name: string, value: any): boolean {
		return isISO31661Alpha3(value);
	}
}
