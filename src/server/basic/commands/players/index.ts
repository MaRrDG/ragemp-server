import { addNewCommand } from "@/customs/commandHandling";
import * as RPC from "rage-rpc";

addNewCommand({
	commandName: "togsnow",
	alias: ["snow"],
	callback: async (player) => {
		const snow = await RPC.callClient(player, "client:toggleSnow");
		player.vars.snow = snow;
		player.sendSuccessMessage(`Snow ${snow ? "activated" : "deactivated"} successfully.`);
	}
});

addNewCommand({
	commandName: "timestamp",
	callback: async (player) => {
		RPC.callClient(player, "client:showTimestamp");
	}
});
