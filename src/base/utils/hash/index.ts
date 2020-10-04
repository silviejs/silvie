import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { TDigestType, TData, THashMethod } from 'base/utils/hash/types';

// console.log(crypto.getHashes());

export default class Hash {
	/**
	 * Uses bcrypt to make hash from a plain value
	 * @param plain
	 */
	static make(plain: string): string {
		return bcrypt.hashSync(plain, 8);
	}

	/**
	 * Uses bcrypt to compare a plain value against a hashed value
	 * @param plain
	 * @param hashed
	 */
	static check(plain: string, hashed: string): boolean {
		return bcrypt.compareSync(plain, hashed);
	}

	/**
	 * Hashes the specified data
	 * @param data Data to be hashed
	 * @param algorithm Hashing algorithm (defaults to sha256)
	 * @param digest returning digest type (defaults to hex)
	 */
	static hash(data: TData, algorithm?: THashMethod, digest?: TDigestType) {
		return crypto
			.createHash(algorithm || 'sha256')
			.update(data)
			.digest(digest || 'hex');
	}
}
