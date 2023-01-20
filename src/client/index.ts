import * as RPC from 'rage-rpc';

mp.browsers.new('http://26.82.68.149:3000');
const player = mp.players.local;

RPC.register('toggleSnow', (bool: boolean) => {
	//@ts-ignore
	mp.game1.gameplay.enableSnow = bool;
});

RPC.register('showAuthentication', (bool) => {
	setTimeout(() => {
		mp.gui.cursor.show(bool, bool);
		mp.gui.chat.show(!bool);
		mp.game.ui.displayRadar(!bool);
		player.setInvincible(bool);
	}, 100);

	RPC.triggerBrowsers('brw:showAuthentication', bool);
});
