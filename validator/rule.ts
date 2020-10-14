export default interface IValidationRule {
	validate(value: any, ...params: any[]): boolean;
}

export const validationRules = {};

export function rule(name: string): (target: any) => any {
	return (Class: IValidationRule): IValidationRule => {
		validationRules[name] = (Class as any).prototype.validate;

		return Class;
	};
}
