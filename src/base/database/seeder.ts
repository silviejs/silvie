export default interface ISeeder {
	tableName: string;

	seed(): Promise<any>;
}
