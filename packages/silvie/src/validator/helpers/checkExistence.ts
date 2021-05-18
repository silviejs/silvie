export default (value: any): boolean => {
	if (value !== null && value !== undefined) {
		if (typeof value === 'string') {
			return value.trim().length > 0;
		}

		return true;
	}

	return false;
};
