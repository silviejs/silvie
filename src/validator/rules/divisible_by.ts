import IValidationRule, { rule } from 'src/validator/rule';
import { isDivisibleBy } from 'validator';

@rule('divisibleBy')
export default class DivisibleByRule implements IValidationRule {
	validate(value: any, divider: string): boolean {
		return isDivisibleBy(value, divider);
	}
}
