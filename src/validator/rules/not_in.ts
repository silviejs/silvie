import IValidationRule, { rule } from 'src/validator/rule';
import Validator from 'src/validator';

@rule('notIn')
export default class InRule implements IValidationRule {
	validate(validator: Validator, value: any, ...keys: string[]): boolean {
		return !keys.includes(`${value}`);
	}
}
