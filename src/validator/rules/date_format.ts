import IValidationRule, { rule } from 'src/validator/rule';
import moment from 'moment';

@rule('dateFormat')
export default class DateFormatRule implements IValidationRule {
	validate(value: any, format: string): boolean {
		if (!format) {
			return false;
		}

		return moment(value, format).isValid();
	}
}
