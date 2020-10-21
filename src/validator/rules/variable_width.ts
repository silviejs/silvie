import IValidationRule, { rule } from 'src/validator/rule';
import { isVariableWidth } from 'validator';

@rule('variableWidth')
export default class VariableWidthRule implements IValidationRule {
	validate(value: any): boolean {
		return isVariableWidth(value);
	}
}
