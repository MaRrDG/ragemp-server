import * as RPC from 'rage-rpc';

RPC.register('toggleSnow', (bool: boolean) => {
	//@ts-ignore
	mp.game1.gameplay.enableSnow = bool;
});
