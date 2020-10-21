import IValidationRule, { rule } from 'src/validator/rule';
import { isFQDN } from 'validator';

@rule('fqdn')
export default class FQDNRule implements IValidationRule {
	validate(value: any): boolean {
		return isFQDN(value);
	}
}
