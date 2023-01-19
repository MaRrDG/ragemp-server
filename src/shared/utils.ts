export const generateRandomRGBColorAsArray = (): [number, number, number] => {
	return [Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255)];
};

export const rageConsole = {
	error: (message?: any) => {
		return console.log(`\x1b[31m[ERROR]\x1b[0m ${message}`);
	},
	done: (message?: any) => {
		return console.log(`\x1b[32m[DONE]\x1b[0m ${message}`);
	},

	info: (message?: any) => {
		return console.log(`\x1b[33m[INFO]\x1b[0m ${message}`);
	},

	load: (message?: any) => {
		return console.log(`\x1b[35m[LOAD]\x1b[0m ${message}`);
	},

	query: (message?: any) => {
		return console.log(`\x1b[36m[QUERY]\x1b[0m ${message}`);
	}
};
