import IValidationRule, { rule } from 'src/validator/rule';
import Validator from 'src/validator';
import { isVariableWidth } from 'validator';

@rule('variableWidth')
export default class VariableWidthRule implements IValidationRule {
	validate(validator: Validator, value: any): boolean {
		return isVariableWidth(value);
	}
}
