import IValidationRule, { rule } from 'src/validator/rule';
import { isJWT } from 'validator';

@rule('jwt')
export default class JWTRule implements IValidationRule {
	validate(value: any): boolean {
		return isJWT(value);
	}
}
