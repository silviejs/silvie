import IValidationRule, { rule } from 'src/validator/rule';
import { isHash } from 'validator';

@rule('hash')
export default class HashRule implements IValidationRule {
	validate(value: any, algorithm: string): boolean {
		return isHash(value, algorithm);
	}
}
