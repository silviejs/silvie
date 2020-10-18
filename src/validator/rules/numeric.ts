import IValidationRule, { rule } from 'src/validator/rule';
import { isNumeric } from 'validator';

@rule('numeric')
export default class NumericRule implements IValidationRule {
	validate(value: any): boolean {
		return typeof value === 'number' || isNumeric(value);
	}
}
