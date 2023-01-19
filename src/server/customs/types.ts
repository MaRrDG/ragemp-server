import { IUser } from './../api/models/userModel';
import { DeepPartial } from './../@types/index.d';

declare global {
	interface PlayerMetadata extends IUser {}

	interface PlayerVars {
		loadPlayerInfo: boolean;
	}

	interface PlayerMp {
		metadata: PlayerMetadata;
		vars: DeepPartial<PlayerVars>;
	}
}

export {};
