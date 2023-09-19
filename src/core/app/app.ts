// Code Author: Adrian Ștefan

import express, { Application } from 'express';

export abstract class App {
	protected app: Application;

	constructor() {
		this.app = express();
	}

	public async start(port: number, host: string): Promise<void> {
		this.app.listen(port, host, () => {
			console.log(`Server is listening on ${port}`);
		});
	}
};
