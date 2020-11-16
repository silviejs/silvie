import IValidationRule, { rule } from 'src/validator/rule';
import Validator from 'src/validator';
import { before } from 'validator';

@rule('before')
export default class BeforeRule implements IValidationRule {
	validate(validator: Validator, name: string, value: any, key: string): boolean {
		return before(value, key);
	}
}
