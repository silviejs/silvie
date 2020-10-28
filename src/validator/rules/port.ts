import IValidationRule, { rule } from 'src/validator/rule';
import Validator from 'src/validator';
import { isPort } from 'validator';

@rule('port')
export default class PortRule implements IValidationRule {
	validate(validator: Validator, name: string, value: any): boolean {
		return isPort(value);
	}
}
