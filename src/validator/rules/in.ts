import IValidationRule, { rule } from 'src/validator/rule';

@rule('in')
export default class InRule implements IValidationRule {
	validate(value: any, ...keys: string[]): boolean {
		return keys.includes(`${value}`);
	}
}
