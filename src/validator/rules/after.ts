import IValidationRule, { rule } from 'src/validator/rule';
import Validator from 'src/validator';
import { after } from 'validator';

@rule('after')
export default class AfterRule implements IValidationRule {
	validate(validator: Validator, name: string, value: any, key: string): boolean {
		return after(value, key);
	}
}
