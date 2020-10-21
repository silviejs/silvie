import IValidationRule, { rule } from 'src/validator/rule';
import { isMagnetURI } from 'validator';

@rule('magnetUri')
export default class MagnetURIRule implements IValidationRule {
	validate(value: any): boolean {
		return isMagnetURI(value);
	}
}
