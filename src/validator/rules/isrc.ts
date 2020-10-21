import IValidationRule, { rule } from 'src/validator/rule';
import { isISRC } from 'validator';

@rule('isrc')
export default class ISRCRule implements IValidationRule {
	validate(value: any): boolean {
		return isISRC(value);
	}
}
