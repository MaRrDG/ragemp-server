import { IUser } from "./../../server/api/models/userModel";

declare global {
	type IShared = {
		haveInterfaceOpen?: boolean;
		stats?: IUser["stats"];
	};

	interface IClientEvents {
		loadPlayerInfos: () => void;
	}
}

export {};
