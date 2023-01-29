import * as RPC from "rage-rpc";

RPC.register("toggleSnow", () => {
	const newBool = !mp.storage.data.snow;
	//@ts-ignore
	mp.game1.gameplay.enableSnow = newBool;
	mp.storage.data.snow = newBool;
	mp.storage.flush();

	return newBool;
});

RPC.register("client:loadPlayerInfos", () => {
	["showTimestamp", "snow"].forEach((elem) => {
		if (!mp.storage.data.hasOwnProperty(elem)) {
			mp.storage.data[elem] = false;
		}
	});

	mp.storage.flush();
	setTimeout(() => {
		mp.events.call("loadPlayerInfos");
	}, 500);
});

RPC.register("showTimestamp", () => {
	mp.storage.data.showTimestamp = !mp.storage.data.showTimestamp;

	mp.storage.flush();
	setTimeout(() => {
		mp.events.call("loadPlayerInfos");
	}, 500);
});
