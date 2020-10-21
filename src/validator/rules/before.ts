import IValidationRule, { rule } from 'src/validator/rule';
import { before } from 'validator';

@rule('before')
export default class BeforeRule implements IValidationRule {
	validate(value: any, key: string): boolean {
		return before(value, key);
	}
}
