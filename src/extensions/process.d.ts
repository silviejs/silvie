declare global {
	namespace NodeJS {
		interface Process {
			args: any;
			rootPath: string;
			relativeRootPath: string;
		}
	}
}

export default global;
