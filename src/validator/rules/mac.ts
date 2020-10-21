import IValidationRule, { rule } from 'src/validator/rule';
import { isMACAddress } from 'validator';

@rule('mac')
export default class MACAddressRule implements IValidationRule {
	validate(value: any, noColons = 'false'): boolean {
		return isMACAddress(value, {
			no_colons: noColons && ['yes', 'true', '1'].includes(noColons),
		});
	}
}
