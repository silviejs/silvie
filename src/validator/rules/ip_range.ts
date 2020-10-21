import IValidationRule, { rule } from 'src/validator/rule';
import Validator from 'src/validator';
import { isIPRange } from 'validator';

@rule('ipRange')
export default class IPRangeRule implements IValidationRule {
	validate(validator: Validator, value: any): boolean {
		return isIPRange(value);
	}
}
