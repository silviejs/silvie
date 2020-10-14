import childProcess from 'child_process';
import log from 'silviePath/utils/log';

export default () => {
	log.info('[Silvie Tester]', 'Running all tests...');
	log();

	const cp = childProcess.exec(`jest --passWithNoTests --color`, { encoding: 'utf8' });

	cp.stdout.pipe(process.stdout);
	cp.stderr.pipe(process.stderr);

	cp.on('close', () => {
		log();
		log.success('[Silvie Tester]', 'Successfully finished testing.');
	});
};
