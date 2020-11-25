export default interface IAuthDriver {
	generate(payload: any): string;
	validate(token: string): any;
	invalidate(token: string): boolean;
}
