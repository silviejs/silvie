export default interface IAuthDriver {
	generate(payload: any): string;
	validate(token: string): boolean;
	invalidate(token: string): boolean;
}
