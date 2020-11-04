export default interface IValidationRule {
	validate(value: any, ...params: any[]): boolean;
}

export const validationRules = {};

export function rule(name: string): (target: any) => any {
	return (Class: IValidationRule): IValidationRule => {
		validationRules[name] = {
			validate: (Class as any).prototype.validate,
			messenger: (Class as any).prototype.messenger,
		};

		return Class;
	};
}
