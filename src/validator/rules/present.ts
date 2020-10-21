import IValidationRule, { rule } from 'src/validator/rule';

@rule('present')
export default class PresentRule implements IValidationRule {
	validate(value: any): boolean {
		return value !== undefined || null;
	}
}
