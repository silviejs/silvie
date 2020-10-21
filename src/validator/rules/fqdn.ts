import IValidationRule, { rule } from 'src/validator/rule';
import Validator from 'src/validator';
import { isFQDN } from 'validator';

@rule('fqdn')
export default class FQDNRule implements IValidationRule {
	validate(validator: Validator, value: any): boolean {
		return isFQDN(value);
	}
}
