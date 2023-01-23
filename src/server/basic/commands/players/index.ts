import { addNewCommand } from "@/customs/commandHandling";
import * as RPC from "rage-rpc";

addNewCommand({
	commandName: "clearmychat",
	alias: ["cmc"],
	callback: async (player) => {
		for (let i = 0; i < 30; i++) player.outputChatBox("");
		player.sendSuccessMessage("Your chat has been cleared successfully.");
	}
});

addNewCommand({
	commandName: "togsnow",
	alias: ["snow"],
	callback: async (player) => {
		player.vars.snow = !player.vars.snow;
		RPC.callClient(player, "toggleSnow", player.vars.snow ? true : false);
		player.sendSuccessMessage(`Snow ${player.vars.snow ? "activated" : "deactivated"} successfully`);
	}
});
