import IValidationRule, { rule } from 'src/validator/rule';
import { isNumeric } from 'validator';

@rule('numeric')
export default class NumericRule implements IValidationRule {
	validate(value: any, locale?: string, noSymbols = 'false'): boolean {
		return (
			typeof value === 'number' ||
			isNumeric(value, {
				locale,
				no_symbols: noSymbols && ['yes', 'true', '1'].includes(noSymbols),
			})
		);
	}
}
