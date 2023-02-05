import * as RPC from "rage-rpc";
const player = mp.players.local;
let camera1: CameraMp;
let camera2: CameraMp;

RPC.register("showAuthentication", (bool) => {
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
