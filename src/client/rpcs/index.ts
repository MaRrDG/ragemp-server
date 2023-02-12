import * as RPC from "rage-rpc";
const player = mp.players.local;

RPC.register("client:toggleSnow", () => {
	const newBool = !mp.storage.data.snow;
	//@ts-ignore
	mp.game1.gameplay.enableSnow = newBool;
	mp.storage.data.snow = newBool;
	mp.storage.flush();

	return newBool;
});

RPC.register("client:getCamPos", () => {
	const camera = mp.cameras.new("gameplay");
	const position = camera.getCoord();
	const direction = camera.getDirection();

	return { position, direction };
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

RPC.register("client:showTimestamp", () => {
	mp.storage.data.showTimestamp = !mp.storage.data.showTimestamp;

	mp.storage.flush();
	setTimeout(() => {
		mp.events.call("loadPlayerInfos");
	}, 500);
});

let camera1: CameraMp;
let camera2: CameraMp;

RPC.register("client:showAuthentication", (bool) => {
	setTimeout(() => {
		mp.gui.cursor.show(bool, bool);
		mp.game.ui.displayRadar(!bool);
		player.setInvincible(bool);
		player.freezePosition(bool);

		if (camera1 && camera2) {
			camera1.destroy();
			camera2.destroy();
		} else {
			camera1 = mp.cameras.new("default", new mp.Vector3(411.1448, 120.211, 108.4997), new mp.Vector3(0, 0, 0), 60);
			camera2 = mp.cameras.new("default", new mp.Vector3(245.8766, 180.4, 114.8928), new mp.Vector3(0, 0, 0), 60);
			camera1.pointAtCoord(245.8766, 180.4, 114.8928);
			camera1.setActiveWithInterp(camera2.handle, 20000, 0, 0);
		}

		camera1.setActive(bool);
		mp.game.cam.renderScriptCams(bool, false, 0, true, false);
	}, 100);

	RPC.triggerBrowsers("brw:showAuthentication", bool);
});
