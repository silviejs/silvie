import IValidationRule, { rule } from 'src/validator/rule';
import Validator from 'src/validator';
import { isMagnetURI } from 'validator';

@rule('magnetUri')
export default class MagnetURIRule implements IValidationRule {
	validate(validator: Validator, value: any): boolean {
		return isMagnetURI(value);
	}
}
