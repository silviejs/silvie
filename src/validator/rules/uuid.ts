import IValidationRule, { rule } from 'src/validator/rule';
import Validator from 'src/validator';
import { isUUID } from 'validator';

@rule('uuid')
export default class UUIDRule implements IValidationRule {
	validate(validator: Validator, value: any, version?: string): boolean {
		return isUUID(value, version);
	}
}
