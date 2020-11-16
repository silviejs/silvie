import IValidationRule, { rule } from 'src/validator/rule';
import Validator from 'src/validator';
import { isIP } from 'validator';

@rule('ip')
export default class IPRule implements IValidationRule {
	validate(validator: Validator, name: string, value: any, version = '4'): boolean {
		return isIP(value, version);
	}
}
