export default interface IMigration {
	up(): Promise<any>;
	down(): Promise<any>;
}
