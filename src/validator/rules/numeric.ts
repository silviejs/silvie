import IValidationRule, { rule } from 'src/validator/rule';
import Validator from 'src/validator';
import { isNumeric } from 'validator';

@rule('numeric')
export default class NumericRule implements IValidationRule {
	validate(validator: Validator, value: any, locale?: string, noSymbols = 'false'): boolean {
		return (
			typeof value === 'number' ||
			isNumeric(value, {
				locale,
				no_symbols: noSymbols && ['yes', 'true', '1'].includes(noSymbols),
			})
		);
	}
}
