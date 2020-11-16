import IValidationRule, { rule } from 'src/validator/rule';
import Validator from 'src/validator';
import checkExistence from 'src/validator/helpers/checkExistence';

@rule('required')
export default class RequiredRule implements IValidationRule {
	validate(validator: Validator, name: string, value: any): boolean {
		return checkExistence(value) || null;
	}
}
