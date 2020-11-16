import IValidationRule, { rule } from 'src/validator/rule';
import Validator from 'src/validator';
import { isMD5 } from 'validator';

@rule('md5')
export default class MD5Rule implements IValidationRule {
	validate(validator: Validator, name: string, value: any): boolean {
		return isMD5(value);
	}
}
