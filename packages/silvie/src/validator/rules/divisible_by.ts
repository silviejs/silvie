import IValidationRule, { rule } from 'src/validator/rule';
import Validator from 'src/validator';
import { isDivisibleBy } from 'validator';

@rule('divisibleBy')
export default class DivisibleByRule implements IValidationRule {
	validate(validator: Validator, name: string, value: any, divider: string): boolean {
		return isDivisibleBy(value, divider);
	}
}
