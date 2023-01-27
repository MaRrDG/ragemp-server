import * as RPC from "rage-rpc";

mp.events.add("loadPlayerInfos", () => {
	//@ts-ignore
	mp.game1.gameplay.enableSnow = mp.storage.data.snow;

	RPC.triggerBrowsers("brw:loadPlayerInfos", {
		player: {
			showTimestamp: mp.storage.data.showTimestamp
		}
	});
});
