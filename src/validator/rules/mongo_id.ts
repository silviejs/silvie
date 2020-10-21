import IValidationRule, { rule } from 'src/validator/rule';
import { isMongoId } from 'validator';

@rule('mongoId')
export default class MongoIdRule implements IValidationRule {
	validate(value: any): boolean {
		return isMongoId(value);
	}
}
