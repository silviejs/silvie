export default interface ISeeder {
	seed(): Promise<any>;
}
