import { IUser } from "./../../server/api/models/userModel";

export type IShared = {
	haveInterfaceOpen?: boolean;
	stats?: IUser["stats"];
};
