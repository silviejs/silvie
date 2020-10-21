import IValidationRule, { rule } from 'src/validator/rule';
import Validator from 'src/validator';
import { isMACAddress } from 'validator';

@rule('mac')
export default class MACAddressRule implements IValidationRule {
	validate(validator: Validator, value: any, noColons = 'false'): boolean {
		return isMACAddress(value, {
			no_colons: noColons && ['yes', 'true', '1'].includes(noColons),
		});
	}
}
