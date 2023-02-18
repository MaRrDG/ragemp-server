import * as RPC from "rage-rpc";

const player = mp.players.local;
export let sharedVariables: IShared = {};

mp.events.add("loadPlayerInfos", () => {
	//@ts-ignore
	mp.game1.gameplay.enableSnow = mp.storage.data.snow;

	RPC.triggerBrowsers("brw:loadPlayerInfos", {
		player: {
			showTimestamp: mp.storage.data.showTimestamp,
			id: player.remoteId
		}
	});
});

mp.events.addDataHandler("updateSharedVariables", (entity, { variables }) => {
	if (entity && entity.remoteId === player.remoteId) {
		for (const [key, value] of Object.entries(variables)) {
			//@ts-ignore
			sharedVariables[key] = value;
		}
	}
});
