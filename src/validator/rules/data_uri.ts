import IValidationRule, { rule } from 'src/validator/rule';
import { isDataURI } from 'validator';

@rule('dataUri')
export default class DataURIRule implements IValidationRule {
	validate(value: any): boolean {
		return isDataURI(value);
	}
}
