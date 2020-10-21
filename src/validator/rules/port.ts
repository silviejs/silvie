import IValidationRule, { rule } from 'src/validator/rule';
import { isPort } from 'validator';

@rule('port')
export default class PortRule implements IValidationRule {
	validate(value: any): boolean {
		return isPort(value);
	}
}
