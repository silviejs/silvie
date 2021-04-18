import IValidationRule, { rule } from 'src/validator/rule';
import Validator from 'src/validator';

@rule('in')
export default class InRule implements IValidationRule {
	validate(validator: Validator, name: string, value: any, ...keys: string[]): boolean {
		return keys.includes(`${value}`);
	}
}
