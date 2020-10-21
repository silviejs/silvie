import IValidationRule, { rule } from 'src/validator/rule';
import { after } from 'validator';

@rule('after')
export default class AfterRule implements IValidationRule {
	validate(value: any, key: string): boolean {
		return after(value, key);
	}
}
