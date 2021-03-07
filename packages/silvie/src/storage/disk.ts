import { Stats, ReadStream, WriteStream, createReadStream, createWriteStream } from 'fs';
import fs from 'fs/promises';
import { resolve, join, dirname, basename } from 'path';
import ncp from 'ncp';

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
	 * Get file stats
	 * @param filename
	 */
	stat(filename: string): Promise<Stats> {
		return fs.stat(this.resolve(filename));
	}

	/**
	 * Reads a file with the given options
	 * @param filename
	 * @param options
	 */
	get(filename: string, options?: TReadOptions): Promise<string | Buffer> {
		return fs.readFile(this.resolve(filename), options);
	}

	/**
	 * Writes a content to a file with the given options
	 * @param filename
	 * @param contents
	 * @param options
	 */
	async put(filename: string, contents: string | Buffer | Uint8Array, options: TWriteOptions): Promise<boolean> {
		await fs.writeFile(this.resolve(filename), contents, options);

		return true;
	}

	/**
	 * Checks to see if a file exists
	 * @param filename
	 */
	async exists(filename: string): Promise<boolean> {
		try {
			await fs.stat(this.resolve(filename));
			return true;
		} catch {
			return false;
		}
	}

	/**
	 * Checks to see if a file not exists
	 * @param filename
	 */
	async missing(filename: string): Promise<boolean> {
		return !(await this.exists(filename));
	}

	/**
	 * Check to see if a path is a directory
	 * @param path
	 */
	async isDirectory(path: string): Promise<boolean> {
		return (await this.stat(path)).isDirectory();
	}

	/**
	 * Rename a file
	 * @param oldPath
	 * @param newPath
	 */
	async rename(oldPath: string, newPath: string): Promise<boolean> {
		if (await this.exists(oldPath)) {
			if (!(await this.exists(newPath))) {
				if (dirname(oldPath) === dirname(newPath)) {
					await fs.rename(this.resolve(oldPath), this.resolve(newPath));

					return true;
				}
			}
		}

		return false;
	}

	/**
	 * Move a file
	 * @param oldPath
	 * @param newPath
	 * @param overwrite
	 */
	async move(oldPath: string, newPath: string, overwrite = false): Promise<boolean> {
		if (await this.exists(oldPath)) {
			let dstPath = newPath;

			if (await this.isDirectory(newPath)) {
				dstPath = join(newPath, basename(oldPath));
			}

			if (overwrite || !(await this.exists(dstPath))) {
				await fs.rename(this.resolve(oldPath), this.resolve(dstPath));

				return true;
			}
		}

		return false;
	}

	/**
	 * Copy a file or directory
	 * @param source
	 * @param destination
	 * @param overwrite
	 */
	async copy(source: string, destination: string, overwrite = false): Promise<boolean> {
		if (await this.isDirectory(source)) {
			return this.copyDirectory(source, destination, overwrite);
		}

		return this.copyFile(source, destination, overwrite);
	}

	/**
	 * Copy a file
	 * @param filename
	 * @param destination
	 * @param overwrite
	 */
	async copyFile(filename: string, destination: string, overwrite = false): Promise<boolean> {
		if (await this.exists(filename)) {
			let dest = destination;

			if (await this.isDirectory(destination)) {
				dest = join(destination, basename(filename));
			}

			if (overwrite || !(await this.exists(dest))) {
				await fs.copyFile(this.resolve(filename), this.resolve(dest));

				return true;
			}
		}

		return false;
	}

	/**
	 * Copy a directory
	 * @param source
	 * @param destination
	 * @param overwrite
	 */
	async copyDirectory(source: string, destination: string, overwrite = false): Promise<boolean> {
		if (await this.isDirectory(source)) {
			let dest = destination;

			if (await this.isDirectory(destination)) {
				dest = join(destination, basename(source));
			}

			if (overwrite || !(await this.exists(dest))) {
				return new Promise<boolean>((resolveFn, rejectFn) => {
					try {
						ncp(this.resolve(source), this.resolve(dest), (error) => {
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
		}

		return false;
	}

	/**
	 * Delete a file or directory
	 * @param path
	 * @param recursive
	 */
	async delete(path: string, recursive = false): Promise<boolean> {
		if (await this.isDirectory(path)) {
			return this.deleteDirectory(path, recursive);
		}

		return this.deleteFile(path);
	}

	/**
	 * Delete a file
	 * @param filename
	 */
	async deleteFile(filename: string): Promise<boolean> {
		await fs.unlink(this.resolve(filename));

		return true;
	}

	/**
	 * Delete a directory
	 * @param path
	 * @param recursive
	 */
	async deleteDirectory(path: string, recursive = false): Promise<boolean> {
		await fs.rmdir(this.resolve(path), { recursive });

		return true;
	}

	/**
	 * Create a directory
	 * @param path
	 * @param recursive
	 * @param mode
	 */
	async makeDirectory(path: string, recursive = false, mode = 0o777): Promise<boolean> {
		await fs.mkdir(this.resolve(path), {
			recursive,
			mode,
		});

		return true;
	}

	/**
	 * Create a read stream from a path
	 * @param path
	 * @param options
	 */
	readStreamFrom(path: string, options?: TReadStreamOptions): ReadStream {
		return createReadStream(this.resolve(path), options);
	}

	/**
	 * Create a write stream to a path
	 * @param path
	 * @param options
	 */
	writeStreamTo(path: string, options?: TWriteStreamOptions): WriteStream {
		return createWriteStream(this.resolve(path), options);
	}
}
