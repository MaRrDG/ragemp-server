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
		const snow = await RPC.callClient(player, "toggleSnow");
		player.sendSuccessMessage(`Snow ${snow ? "activated" : "deactivated"} successfully.`);
	}
});

addNewCommand({
	commandName: "timestamp",
	callback: async (player) => {
		RPC.callClient(player, "showTimestamp");
	}
});
