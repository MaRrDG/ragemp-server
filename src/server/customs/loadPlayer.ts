import { IUser } from "./../api/models/userModel";
import { rageConsole } from "./../../shared/utils";
import { AccountsService } from "@/api/services/userService";
import * as RPC from "rage-rpc";

const accountsService = new AccountsService();

mp.events.add("playerJoin", async (player) => {
	player.vars = {};
	player.vars.loadPlayerInfo = true;

	RPC.callClient(player, "showAuthentication", true);
});

mp.events.add("playerQuit", (player) => {
	try {
		if (player.vars.loadPlayerInfo) return;
		accountsService.patchEntity({ username: player.name, entity: player.metadata });
	} catch (e) {
		rageConsole.error(e);
	}
});

RPC.register("brw:checkPlayerCredentials", async (credentials, info) => {
	const player = info.player as PlayerMp;
	const { username, password } = credentials;

	try {
		const alreadyPlayer = mp.players.toArray().filter((player) => player.metadata && player.metadata.username === username);
		if (alreadyPlayer.length) {
			player.showToast({ type: "error", message: "Login failed, this account is already online.", seconds: 5000 });
			player.kick("User already online.");
		}

		const resultData: any = await accountsService.getEntityByUsername({ username: username });
		if (!resultData || resultData.password !== password)
			return player.showToast({ type: "error", message: "Login failed, your username or password is incorrect.", seconds: 5000 });

		setTimeout(() => {
			RPC.callClient(player, "showAuthentication", false);

			const { _id, __v, password, rgscId, socialClub, uuid, ...user } = resultData._doc;

			mp.events.call("loadPlayerInfos", player, user);
			player.outputChatBox(`Welcome back, ${player.name}.`);
		}, 500);
	} catch (e) {
		rageConsole.error(e);
	}
});

RPC.register("brw:createPlayerCredentials", async (credentials, info) => {
	const player = info.player as PlayerMp;
	const { username, email, password } = credentials;

	try {
		const resultData: any = await accountsService.getEntityByUsername({ username: username });
		if (resultData) return player.showToast({ type: "error", message: "Register failed, this account already exists.", seconds: 5000 });

		accountsService.postEntity({
			entity: {
				username,
				email,
				password,
				rgscId: player.rgscId,
				socialClub: player.socialClub,
				uuid: player.serial
			}
		});

		player.name = username;

		setTimeout(async () => {
			RPC.callClient(player, "showAuthentication", false);
			const resultData: any = await accountsService.getEntityByUsername({ username: player.name });
			if (!resultData) return;

			const { _id, __v, password, rgscId, socialClub, uuid, ...user } = resultData._doc;

			mp.events.call("loadPlayerInfos", player, user);
			player.outputChatBox(`Welcome, ${player.name}.`);
		}, 500);
	} catch (e) {
		rageConsole.error(e);
	}
});

mp.events.add("loadPlayerInfos", async (player: PlayerMp, user: IUser) => {
	try {
		player.name = user.username;
		player.metadata = user;
		player.vars.loadPlayerInfo = false;

		RPC.callClient(player, "client:loadPlayerInfos");
	} catch (e) {
		rageConsole.error(e);
	}
});
