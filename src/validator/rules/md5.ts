import IValidationRule, { rule } from 'src/validator/rule';
import { isMD5 } from 'validator';

@rule('md5')
export default class MD5Rule implements IValidationRule {
	validate(value: any): boolean {
		return isMD5(value);
	}
}
