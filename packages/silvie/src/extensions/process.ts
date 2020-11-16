declare global {
	namespace NodeJS {
		interface Process {
			args: any;
			path: string;
			rootPath: string;
			silviePath: string;
			relativeRootPath: string;
			autoLoadedConfigs: Record<string, any>;
			configs: Record<string, any>;
		}
	}
}

export default global;
