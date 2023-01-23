import * as RPC from "rage-rpc";

RPC.register("toggleSnow", (bool: boolean) => {
	//@ts-ignore
	mp.game1.gameplay.enableSnow = bool;
});

RPC.register("client:loadPlayerInfos", () => {
	if (!mp.storage.data.showTimestamp) {
		mp.storage.data.showTimestamp = false;
	}

	mp.storage.flush();
	setTimeout(() => {
		mp.events.call("loadPlayerInfos");
	}, 500);
});
