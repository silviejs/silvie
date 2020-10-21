import IValidationRule, { rule } from 'src/validator/rule';
import Validator from 'src/validator';
import { isISRC } from 'validator';

@rule('isrc')
export default class ISRCRule implements IValidationRule {
	validate(validator: Validator, value: any): boolean {
		return isISRC(value);
	}
}
