import IValidationRule, { rule } from 'src/validator/rule';
import moment from 'moment';

@rule('date')
export default class DateRule implements IValidationRule {
	validate(value: any, locale?: string): boolean {
		if (locale) {
			return moment(value).locale(locale).isValid();
		}

		return moment(value).isValid();
	}
}
