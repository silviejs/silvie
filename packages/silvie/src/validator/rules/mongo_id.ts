import IValidationRule, { rule } from 'src/validator/rule';
import Validator from 'src/validator';
import { isMongoId } from 'validator';

@rule('mongoId')
export default class MongoIdRule implements IValidationRule {
	validate(validator: Validator, name: string, value: any): boolean {
		return isMongoId(value);
	}
}
