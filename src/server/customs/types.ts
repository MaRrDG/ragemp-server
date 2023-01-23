import { IUser } from "./../api/models/userModel";
import { DeepPartial } from "./../@types/index.d";
import * as RPC from "rage-rpc";

mp.Player.prototype.showToast = function (options: { type: "error" | "success" | "warning" | "info"; message: string; seconds: number }) {
	RPC.triggerBrowsers(this, "brw:showToast", options);
};

declare global {
	interface PlayerMetadata extends IUser {}

	interface PlayerVars {
		loadPlayerInfo: boolean;
	}

	interface PlayerMp {
		metadata: PlayerMetadata;
		vars: DeepPartial<PlayerVars>;
		showToast: ({ type, message, seconds }: { type: "error" | "success" | "warning" | "info"; message: string; seconds: number }) => void;
	}

	interface IServerEvents {
		sendAllAdminMessage: (player: PlayerMp, message: string) => void;
		loadPlayerInfos: (player: PlayerMp) => void;
	}
}

export {};
