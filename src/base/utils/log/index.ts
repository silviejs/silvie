import LogString, { TColor } from 'base/utils/log/string';

function log(...texts: (any | LogString)[]) {
	// eslint-disable-next-line no-console
	console.log(
		...texts.map((text) => {
			if (text instanceof LogString) {
				return text.getText();
			}

			return text;
		})
	);
}

function customLog(type: 'error' | 'warning' | 'info' | 'success', ttl: string, msg?: string) {
	const title =
		msg === undefined ? { error: 'Error', warning: 'Warning', info: 'Info', success: 'Success' }[type] : ttl;
	const message = msg === undefined ? ttl : msg;
	const color = { error: 'red', warning: 'yellow', info: 'cyan', success: 'green' }[type];

	log(new LogString(title).color(color as TColor).bright(), message);
}

log.error = (title: string, message?: string) => customLog('error', title, message);
log.warning = (title: string, message?: string) => customLog('warning', title, message);
log.info = (title: string, message?: string) => customLog('info', title, message);
log.success = (title: string, message?: string) => customLog('success', title, message);

log.str = function logStr(strings: string[], ...params: any[]) {
	return new LogString(strings.map((part, index) => `${part}${params[index] || ''}`).join(''));
};

export default log;
