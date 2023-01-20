import { rageConsole } from './../../shared/utils';
import { AccountsService } from '@/api/services/userService';
import * as RPC from 'rage-rpc';

const accountsService = new AccountsService();

// TODO: daca un alt jucator incearca sa se conecteze cu datele unui jucator on, sa primeasca kick
mp.events.add('playerJoin', async (player) => {
	player.vars = {};

	RPC.callClient(player, 'showAuthentication', true);
});

mp.events.add('playerQuit', (player) => {
	try {
		accountsService.patchEntity({ username: player.name, entity: player.metadata });
	} catch (e) {
		rageConsole.error(e);
	}
});

RPC.register('brw:checkPlayerCredentials', async (credentials, info) => {
	const player = info.player as PlayerMp;
	const { username, password } = credentials;
	try {
		const resultData: any = await accountsService.getEntityByUsername({ username: username });
		// TODO: toast here
		if (!resultData || resultData.password !== password) return;

		setTimeout(() => {
			RPC.callClient(player, 'showAuthentication', false);

			const { _id, __v, password, rgscId, socialClub, uuid, ...user } = resultData._doc;

			player.name = user.username;
			player.metadata = user;
		}, 500);
	} catch (e) {
		rageConsole.error(e);
	}
});

RPC.register('brw:createPlayerCredentials', (credentials, info) => {
	const player = info.player as PlayerMp;
	const { username, email, password } = credentials;

	try {
		accountsService.postEntity({
			entity: {
				username,
				email,
				password,
				rgscId: player.rgscId,
				socialClub: player.socialClub,
				uuid: player.serial
			}
		});

		setTimeout(() => {
			RPC.callClient(player, 'showAuthentication', false);
			mp.events.call('loadPlayerInfos', player);
		}, 500);
	} catch (e) {
		rageConsole.error(e);
	}
});

mp.events.add('loadPlayerInfos', async (player: PlayerMp) => {
	try {
		const resultData: any = await accountsService.getEntityByUsername({ username: player.name });
		if (!resultData) return;

		const { _id, __v, password, rgscId, socialClub, uuid, ...user } = resultData._doc;

		player.name = user.username;
		player.metadata = user;
	} catch (e) {
		rageConsole.error(e);
	}
});
