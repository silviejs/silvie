import IValidationRule, { rule } from 'src/validator/rule';
import Validator from 'src/validator';
import { isJSON } from 'validator';

@rule('json')
export default class JSONRule implements IValidationRule {
	validate(validator: Validator, name: string, value: any, allowPrimitives = 'false'): boolean {
		return isJSON(value, {
			allow_primitives: allowPrimitives && ['yes', 'true', '1'].includes(allowPrimitives),
		});
	}
}
