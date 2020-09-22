declare global {
	module NodeJS {
		interface Process {
			args: any;
		}
	}
}

export default global;
