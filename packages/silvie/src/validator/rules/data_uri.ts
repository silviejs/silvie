import IValidationRule, { rule } from 'src/validator/rule';
import Validator from 'src/validator';
import { isDataURI } from 'validator';

@rule('dataUri')
export default class DataURIRule implements IValidationRule {
	validate(validator: Validator, name: string, value: any): boolean {
		return isDataURI(value);
	}
}
