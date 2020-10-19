import fs from 'fs';
import path from 'path';

export default class BlackList {
	filename: string;

	blackList: string[];

	constructor(filename: string) {
		this.filename = path.resolve(
			process.rootPath,
			(process.env.NODE_ENV === 'development' ? `.silvie/` : '') + filename
		);

		this.blackList = this.readBlacklist();
	}

	/**
	 * Read blacklist from the file
	 * @private
	 */
	private readBlacklist(): string[] {
		try {
			if (fs.existsSync(this.filename)) {
				const content = fs.readFileSync(this.filename, { encoding: 'utf-8' });

				return JSON.parse(content);
			}

			fs.writeFileSync(this.filename, '[]');
			return [];
		} catch {
			return [];
		}
	}

	/**
	 * Write current blacklist array into the file
	 * @private
	 */
	private writeBlacklist(): boolean {
		try {
			fs.writeFileSync(this.filename, JSON.stringify(this.blackList));

			return true;
		} catch {
			return false;
		}
	}

	/**
	 * Add a token to the blacklist
	 * @param token
	 */
	add(token: string): boolean {
		try {
			this.blackList.push(token);

			this.writeBlacklist();

			return true;
		} catch {
			return false;
		}
	}

	/**
	 * Check if a token is blacklisted or not
	 * @param token
	 */
	has(token: string): boolean {
		try {
			return this.blackList.includes(token);
		} catch {
			return false;
		}
	}

	/**
	 * Remove a token from the blacklist
	 * @param token
	 */
	remove(token: string): boolean {
		try {
			const index = this.blackList.indexOf(token);

			if (index >= 0) {
				this.blackList.splice(index, 1);

				this.writeBlacklist();

				return true;
			}

			return false;
		} catch {
			return false;
		}
	}
}
