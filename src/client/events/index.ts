import * as RPC from "rage-rpc";

mp.events.add("loadPlayerInfos", () => {
	RPC.triggerBrowsers("brw:loadPlayerInfos", {
		player: {
			showTimestamp: mp.storage.data.showTimestamp
		}
	});
});
