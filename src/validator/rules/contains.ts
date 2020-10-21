import IValidationRule, { rule } from 'src/validator/rule';
import Validator from 'src/validator';

@rule('contains')
export default class ContainsRule implements IValidationRule {
	validate(validator: Validator, value: any, key: string): boolean {
		return value.includes(key);
	}
}
