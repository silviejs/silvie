import path from 'path';
import fs from 'fs';
import Disk from 'base/storage/disk';
import config from 'config/storage';

export default class Storage {
	static disks: Record<string, Disk>;

	static init() {
		const storagePath = path.resolve(
			process.rootPath,
			(process.env.NODE_ENV === 'development' ? `../.silvie/` : '') + config.path
		);

		if (!fs.existsSync(storagePath)) {
			fs.mkdirSync(storagePath, { recursive: true });
		}

		this.disks = Object.keys(config.disks || {}).reduce((group, diskName) => {
			group[diskName] = new Disk(path.resolve(storagePath, config.disks[diskName]));
			return group;
		}, {});
	}
}
