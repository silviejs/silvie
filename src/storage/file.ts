import path from 'path';
import crypto from 'crypto';
import config from '../../../../Desktop/silvie-test/src/config/storage';

export default class File {
	private fileName: string;

	private fileExt = '';

	private filePath = '';

	get filename(): string {
		return path.join(this.filePath, `${this.fileName}${this.fileExt ? `.${this.fileExt}` : ''}`);
	}

	constructor(filename?: string, extension?: string) {
		if (filename) {
			if (extension) {
				this.fileName = filename;
				this.fileExt = extension;
			} else {
				const parts = filename.split('.');

				if (parts.length > 1) {
					this.fileExt = parts.pop();
					this.fileName = parts.join('.');
				} else {
					this.fileName = filename;
				}
			}
		} else {
			this.randomName();

			if (extension) {
				this.fileExt = extension;
			}
		}
	}

	/**
	 * Generate a random file name
	 */
	randomName() {
		const hashConfig = config.files.hash;
		const hash = crypto.createHash(hashConfig.algorithm).update(`${Date.now()}${Math.random()}${hashConfig.salt}`);

		this.fileName = hash.digest('hex');

		return this;
	}

	/**
	 * Change file instance name
	 * @param filename
	 */
	name(filename: string): File {
		this.fileName = filename;

		return this;
	}

	/**
	 * Change file instance path
	 * @param filePath
	 */
	path(filePath: string): File {
		this.filePath = filePath;

		return this;
	}

	/**
	 * Change file instance extension
	 * @param extension
	 */
	ext(extension: string): File {
		this.fileExt = extension;

		return this;
	}

	toString() {
		return this.filename;
	}
}
