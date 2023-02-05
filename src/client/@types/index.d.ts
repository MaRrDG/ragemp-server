declare global {
	interface IClientEvents {
		loadPlayerInfos: () => void;
	}

	type DeepPartial<T> = T extends object
		? {
				[P in keyof T]?: DeepPartial<T[P]>;
		  }
		: T;
}

export {};
