import DataLoader from 'dataloader';

export default (): any => {
	return new DataLoader(async (keys: number[]) => {
		const results = keys.map((key: number) => key * key);

		return Promise.resolve(results);
	});
};
