import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { THashDigestType, TCipherDigestType, TData, THashMethod, TCipherMethod } from 'base/utils/crypt/types';

export default class Crypt {
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
	static hash(data: TData, algorithm?: THashMethod, digest?: THashDigestType): string {
		return crypto
			.createHash(algorithm || 'sha256')
			.update(data)
			.digest(digest || 'hex');
	}

	/**
	 * Generate random IV
	 * @param length
	 */
	static generateIV(length = 16): Buffer {
		return crypto.randomBytes(length);
	}

	/**
	 * Generate random Key
	 * @param length
	 */
	static generateKey(length = 32): Buffer {
		return crypto.randomBytes(length);
	}

	/**
	 * Encrypt a data with a key and iv
	 * @param data
	 * @param key Encryption key
	 * @param algorithm Encryption algorithm
	 * @param digest Output digest type
	 * @param IVLength Initialization vector length
	 */
	static encrypt(
		data: TData,
		key: string | Buffer,
		algorithm: TCipherMethod,
		digest?: TCipherDigestType,
		IVLength = 16
	): { iv: string; data: string } {
		if (key === undefined) {
			throw new Error('Cannot encrypt without a Key');
		}

		const ivBuffer = this.generateIV(IVLength);
		const keyBuffer = key instanceof Buffer ? key : Buffer.from(key);

		const cipher = crypto.createCipheriv(algorithm, keyBuffer, ivBuffer);
		let encrypted = cipher.update(data);
		encrypted = Buffer.concat([encrypted, cipher.final()]);

		return { data: encrypted.toString(digest || 'hex'), iv: ivBuffer.toString(digest || 'hex') };
	}

	/**
	 * Decrypt a data with a key and iv
	 * @param data
	 * @param key Decryption key
	 * @param iv Initialization vector
	 * @param algorithm Encryption algorithm
	 * @param digest Output digest type
	 */
	static decrypt(
		data: TData,
		key: string | Buffer,
		iv: string | Buffer,
		algorithm: TCipherMethod,
		digest?: TCipherDigestType
	) {
		if (key === undefined || iv === undefined) {
			throw new Error('Cannot decrypt without the Key and IV');
		}

		try {
			const ivBuffer = iv instanceof Buffer ? iv : Buffer.from(iv, digest || 'hex');
			const keyBuffer = key instanceof Buffer ? key : Buffer.from(key);
			const encryptedBuffer = typeof data === 'string' ? Buffer.from(data, digest || 'hex') : data;

			const decipher = crypto.createDecipheriv(algorithm, keyBuffer, ivBuffer);
			let decrypted = decipher.update(encryptedBuffer);
			decrypted = Buffer.concat([decrypted, decipher.final()]);

			return decrypted.toString();
		} catch (e) {
			throw new Error('Something went wrong: Invalid Cipher Data');
		}
	}
}
