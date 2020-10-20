import LogString, { TColor } from 'src/utils/log/string';

function log(...texts: (any | LogString)[]) {
	console.log(
		...texts.map((text) => {
			if (text instanceof LogString) {
				return text.getText();
			}

			return text;
		})
	);
}

function customLog(type: 'error' | 'warning' | 'info' | 'success', title: string, message?: string) {
	const color = { error: 'red', warning: 'yellow', info: 'cyan', success: 'green' }[type];
	const ttl = new LogString(title).color(color as TColor).bright();

	if (message) {
		return log(ttl, message);
	}

	return log(ttl);
}

log.error = (title: string, message?: string) => customLog('error', title, message);
log.warning = (title: string, message?: string) => customLog('warning', title, message);
log.info = (title: string, message?: string) => customLog('info', title, message);
log.success = (title: string, message?: string) => customLog('success', title, message);

log.str = function logStr(strings: TemplateStringsArray, ...params: any[]) {
	return new LogString(strings.map((part, index) => `${part}${params[index] || ''}`).join(''));
};

export default log;
