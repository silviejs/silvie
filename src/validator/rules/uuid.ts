import IValidationRule, { rule } from 'src/validator/rule';
import { isUUID } from 'validator';

@rule('uuid')
export default class UUIDRule implements IValidationRule {
	validate(value: any, version?: string): boolean {
		return isUUID(value, version);
	}
}
