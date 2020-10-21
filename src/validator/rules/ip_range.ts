import IValidationRule, { rule } from 'src/validator/rule';
import { isIPRange } from 'validator';

@rule('ipRange')
export default class IPRangeRule implements IValidationRule {
	validate(value: any): boolean {
		return isIPRange(value);
	}
}
