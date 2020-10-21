import IValidationRule, { rule } from 'src/validator/rule';
import Validator from 'src/validator';
import { isHash } from 'validator';

@rule('hash')
export default class HashRule implements IValidationRule {
	validate(validator: Validator, value: any, algorithm: string): boolean {
		return isHash(value, algorithm);
	}
}
