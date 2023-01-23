import * as RPC from "rage-rpc";
const player = mp.players.local;

RPC.register("showAuthentication", (bool) => {
	setTimeout(() => {
		mp.gui.cursor.show(bool, bool);
		mp.game.ui.displayRadar(!bool);
		player.setInvincible(bool);
	}, 100);

	RPC.triggerBrowsers("brw:showAuthentication", bool);
});
