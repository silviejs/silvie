import fs from 'fs';
import { resolve } from 'path';
import ncp from 'ncp';

type TData =
	| string
	| Uint8Array
	| Uint8ClampedArray
	| Uint16Array
	| Uint32Array
	| Int8Array
	| Int16Array
	| Int32Array
	| Float32Array
	| Float64Array
	| DataView;

type TEncoding = 'utf8' | 'ascii' | 'utf-8' | 'utf16le' | 'ucs2' | 'ucs-2' | 'base64' | 'latin1' | 'binary' | 'hex';

type TReadOptions = TEncoding | { encoding: TEncoding; flag?: string };
type TWriteOptions = TEncoding | { encoding: TEncoding; flag?: string };

type TReadStreamOptions =
	| string
	| {
			flags?: string;
			encoding?: TEncoding;
			fd?: number;
			mode?: number;
			autoClose?: boolean;
			emitClose?: boolean;
			start?: number;
			end?: number;
			highWaterMark?: number;
	  };

type TWriteStreamOptions =
	| string
	| {
			flags?: string;
			encoding?: TEncoding;
			fd?: number;
			mode?: number;
			autoClose?: boolean;
			emitClose?: boolean;
			start?: number;
			highWaterMark?: number;
	  };

export default class Disk {
	private readonly basePath = null;

	/**
	 * Resolve a filename in the current disk
	 * @param filename
	 */
	private resolve = (filename) => {
		return resolve(this.basePath, filename);
	};

	constructor(basePath) {
		this.basePath = basePath;

		if (this.missing(basePath)) {
			this.makeDirectory(basePath, true);
		}
	}

	/**
	 * Reads a file with the given options
	 * @param filename
	 * @param options
	 */
	get(filename: string, options?: TReadOptions): Promise<string | Buffer> {
		return new Promise<string | Buffer>((resolveFn, rejectFn) => {
			try {
				resolveFn(fs.readFileSync(this.resolve(filename), options));
			} catch (e) {
				rejectFn(e);
			}
		});
	}

	/**
	 * Writes a content to a file with the given options
	 * @param filename
	 * @param contents
	 * @param options
	 */
	put(filename: string, contents: TData, options: TWriteOptions): Promise<boolean> {
		return new Promise<boolean>((resolveFn, rejectFn) => {
			try {
				fs.writeFileSync(this.resolve(filename), contents, options);

				resolveFn(true);
			} catch (e) {
				rejectFn(e);
			}
		});
	}

	/**
	 * Checks to see if a file exists
	 * @param filename
	 */
	exists(filename: string): Promise<boolean> {
		return new Promise<boolean>((resolveFn, rejectFn) => {
			try {
				resolveFn(fs.existsSync(this.resolve(filename)));
			} catch (e) {
				rejectFn(e);
			}
		});
	}

	/**
	 * Checks to see if a file not exists
	 * @param filename
	 */
	missing(filename: string): Promise<boolean> {
		return new Promise<boolean>((resolveFn, rejectFn) => {
			try {
				resolveFn(!fs.existsSync(this.resolve(filename)));
			} catch (e) {
				rejectFn(e);
			}
		});
	}

	/**
	 * Rename a file
	 * @param oldPath
	 * @param newPath
	 */
	rename(oldPath: string, newPath: string): Promise<boolean> {
		return new Promise<boolean>((resolveFn, rejectFn) => {
			try {
				fs.renameSync(this.resolve(oldPath), this.resolve(newPath));

				resolveFn(true);
			} catch (e) {
				rejectFn(e);
			}
		});
	}

	/**
	 * Move a file
	 * @param oldPath
	 * @param newPath
	 */
	move(oldPath: string, newPath: string): Promise<boolean> {
		return new Promise<boolean>((resolveFn, rejectFn) => {
			try {
				this.rename(oldPath, newPath).then(resolveFn).catch(rejectFn);
			} catch (e) {
				rejectFn(e);
			}
		});
	}

	/**
	 * Copy a file or directory
	 * @param source
	 * @param destination
	 */
	copy(source: string, destination: string): Promise<boolean> {
		return new Promise<boolean>((resolveFn, rejectFn) => {
			try {
				if (fs.statSync(source).isDirectory()) {
					this.copyDirectory(source, destination).then(resolveFn).catch(rejectFn);
				}

				this.copyFile(source, destination).then(resolveFn).catch(rejectFn);
			} catch (e) {
				rejectFn(e);
			}
		});
	}

	/**
	 * Copy a file
	 * @param filename
	 * @param destination
	 */
	copyFile(filename: string, destination: string): Promise<boolean> {
		return new Promise<boolean>((resolveFn, rejectFn) => {
			try {
				fs.copyFileSync(this.resolve(filename), this.resolve(destination));

				resolveFn(true);
			} catch (e) {
				rejectFn(e);
			}
		});
	}

	/**
	 * Copy a directory
	 * @param source
	 * @param destination
	 */
	copyDirectory(source: string, destination: string): Promise<boolean> {
		return new Promise<boolean>((resolveFn, rejectFn) => {
			try {
				ncp(this.resolve(source), this.resolve(destination), (error) => {
					if (error) {
						rejectFn(error);
					}

					resolveFn(true);
				});
			} catch (e) {
				resolveFn(e);
			}
		});
	}

	/**
	 * Delete a file or directory
	 * @param path
	 * @param recursive
	 */
	delete(path: string, recursive = false): Promise<boolean> {
		return new Promise<boolean>((resolveFn, rejectFn) => {
			try {
				if (fs.statSync(path).isDirectory()) {
					this.deleteDirectory(path, recursive).then(resolveFn).catch(rejectFn);
				}

				this.deleteFile(path).then(resolveFn).catch(rejectFn);
			} catch (e) {
				rejectFn(e);
			}
		});
	}

	/**
	 * Delete a file
	 * @param filename
	 */
	deleteFile(filename: string): Promise<boolean> {
		return new Promise<boolean>((resolveFn, rejectFn) => {
			try {
				fs.unlinkSync(this.resolve(filename));

				resolveFn(true);
			} catch (e) {
				rejectFn(e);
			}
		});
	}

	/**
	 * Delete a directory
	 * @param path
	 * @param recursive
	 */
	deleteDirectory(path: string, recursive = false): Promise<boolean> {
		return new Promise<boolean>((resolveFn, rejectFn) => {
			try {
				fs.rmdirSync(this.resolve(path), { recursive });

				resolveFn(true);
			} catch (e) {
				rejectFn(e);
			}
		});
	}

	/**
	 * Create a directory
	 * @param path
	 * @param recursive
	 * @param mode
	 */
	makeDirectory(path: string, recursive = false, mode = 0o777): Promise<boolean> {
		return new Promise<boolean>((resolveFn, rejectFn) => {
			try {
				fs.mkdirSync(this.resolve(path), {
					recursive,
					mode,
				});

				resolveFn(true);
			} catch (e) {
				rejectFn(e);
			}
		});
	}

	/**
	 * Create a read stream from a path
	 * @param path
	 * @param options
	 */
	readStreamFrom(path: string, options?: TReadStreamOptions): fs.ReadStream {
		return fs.createReadStream(this.resolve(path), options);
	}

	/**
	 * Create a write stream to a path
	 * @param path
	 * @param options
	 */
	writeStreamTo(path: string, options?: TWriteStreamOptions): fs.WriteStream {
		return fs.createWriteStream(this.resolve(path), options);
	}
}
