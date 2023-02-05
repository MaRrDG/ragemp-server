import { IUser } from "./../api/models/userModel";
import { rageConsole } from "@shared/utils";
import { AccountsService } from "@/api/services/userService";
import * as RPC from "rage-rpc";

const accountsService = new AccountsService();

mp.events.add("playerReady", async (player) => {
	player.vars = {};
	player.vars.loadPlayerInfo = true;
	player.position = new mp.Vector3(413.0605, 121.1927, 108.1837);
	player.alpha = 0;
	player.dimension = player.id;
	RPC.triggerBrowsers(player, "brw:updateOnlinePlayers", mp.players.length);

	setTimeout(() => {
		RPC.callClient(player, "showAuthentication", true);
		player.setVariable("updateSharedVariables", {
			variables: {
				haveInterfaceOpen: true
			}
		});
	}, 200);

	setInterval(() => {
		RPC.triggerBrowsers(player, "brw:updateOnlinePlayers", mp.players.length);
	}, 15000);
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
		player.position = new mp.Vector3(-146.0594, -872.1219, 29.8046);
		player.alpha = 255;
		player.heading = 120;
		player.dimension = 0;

		RPC.callClient(player, "client:loadPlayerInfos");
		RPC.triggerBrowsers(player, "brw:updateHud", {
			bankMoney: player.metadata.stats.bankMoney,
			money: player.metadata.stats.money
		});
		player.setVariable("updateSharedVariables", {
			variables: {
				haveInterfaceOpen: false,
				stats: user.stats
			}
		});
	} catch (e) {
		rageConsole.error(e);
	}
});
