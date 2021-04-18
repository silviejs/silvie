declare module 'src/cli/commands/*' {}
declare module 'src/cli/commands/make/makers/*' {}
declare module 'src/cli/commands/help/commands/*' {}

declare module '*.txt' {
	const value: string;
	export = value;
}
