import jwt from 'jsonwebtoken';

import BlackList from 'src/authentication/driver/drivers/jwt/blacklist';
import IAuthDriver from 'src/authentication/driver';

type JWTConfig = { secret: string; blacklist: string };

export default class JWTDriver implements IAuthDriver {
	blacklist: BlackList;

	config: JWTConfig;

	constructor(config: JWTConfig) {
		this.config = config;
		this.blacklist = new BlackList(config.blacklist);
	}

	/**
	 * Generate a JWT token from the given payload
	 * @param payload
	 */
	generate(payload: any): string {
		return jwt.sign(payload, this.config.secret || process.env.APP_KEY);
	}

	/**
	 * Validates a given token and returns the payload
	 * @param token
	 */
	validate(token: string): any {
		try {
			if (!this.blacklist.has(token)) {
				return jwt.verify(token, this.config.secret || process.env.APP_KEY);
			}

			return null;
		} catch {
			return null;
		}
	}

	/**
	 * Invalidates a given token
	 * @param token
	 */
	invalidate(token: string): boolean {
		try {
			if (!this.blacklist.has(token)) {
				this.blacklist.add(token);
				return true;
			}

			return false;
		} catch {
			return false;
		}
	}
}
