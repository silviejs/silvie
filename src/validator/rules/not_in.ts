import IValidationRule, { rule } from 'src/validator/rule';

@rule('notIn')
export default class InRule implements IValidationRule {
	validate(value: any, ...keys: string[]): boolean {
		return !keys.includes(`${value}`);
	}
}
