import log from 'silviePath/utils/log';

export default () => {
	log.warning('SILVIE CLI - Test');
	log('This command will run all tests in this project.');
	log('The test will be searched for in PROJECT/test and PROJECT/src');

	log();
	log.info('Usage:');
	log('  silvie test');
};
