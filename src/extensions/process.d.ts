declare global {
	namespace NodeJS {
		interface Process {
			args: any;
			rootPath: string;
			silviePath: string;
			relativeRootPath: string;
			configs: Record<string, any>;
		}
	}
}

export default global;
