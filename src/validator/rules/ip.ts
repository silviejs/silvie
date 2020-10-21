import IValidationRule, { rule } from 'src/validator/rule';
import { isIP } from 'validator';

@rule('ip')
export default class IPRule implements IValidationRule {
	validate(value: any, version = '4'): boolean {
		return isIP(value, version);
	}
}
