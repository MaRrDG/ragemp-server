import * as RPC from 'rage-rpc';

mp.browsers.new('http://localhost:3000');

RPC.register('toggleSnow', (bool: boolean) => {
	//@ts-ignore
	mp.game1.gameplay.enableSnow = bool;
});

RPC.register('showAuthentication', (bool) => {
	setTimeout(() => {
		mp.gui.cursor.show(bool, bool);
		mp.gui.chat.show(!bool);
		mp.game.ui.displayRadar(!bool);
	}, 100);

	RPC.triggerBrowsers('brw:showAuthentication', bool);
});
