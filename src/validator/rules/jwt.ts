import IValidationRule, { rule } from 'src/validator/rule';
import Validator from 'src/validator';
import { isJWT } from 'validator';

@rule('jwt')
export default class JWTRule implements IValidationRule {
	validate(validator: Validator, value: any): boolean {
		return isJWT(value);
	}
}
