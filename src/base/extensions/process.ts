declare global {
	namespace NodeJS {
		interface Process {
			args: any;
		}
	}
}

export default global;
