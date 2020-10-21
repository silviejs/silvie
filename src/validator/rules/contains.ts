import IValidationRule, { rule } from 'src/validator/rule';

@rule('contains')
export default class ContainsRule implements IValidationRule {
	validate(value: any, key: string): boolean {
		return value.includes(key);
	}
}
