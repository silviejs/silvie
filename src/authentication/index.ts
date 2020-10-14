import drivers from 'base/driver/drivers';
import IAuthDriver from 'src/authentication/driver';
import config from '../../../../Desktop/silvie-test/src/config/auth';

class Auth {
	static driver: IAuthDriver;

	token: string;

	payload: any;

	constructor(payload: any, token: string) {
		this.token = token;
		this.payload = payload;
	}

	static init() {
		if (config.driver in drivers && config.driver in config) {
			this.driver = new drivers[config.driver](config[config.driver]);
		}
	}

	/**
	 * Generates a token for the given payload
	 * @param payload
	 */
	static login(payload: any): Auth {
		const token = this.driver.generate(payload);

		if (token) {
			return new Auth(payload, token);
		}

		return null;
	}

	/**
	 * Checks a token to see if it is valid or not
	 * @param token
	 */
	static check(token: string): Auth {
		const payload = this.driver.validate(token);

		if (payload) {
			return new Auth(payload, token);
		}

		return null;
	}

	/**
	 * Invalidates the current auth instance
	 */
	logout(): boolean {
		return Auth.driver.invalidate(this.token);
	}
}

export default Auth;
