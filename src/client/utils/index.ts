import * as RPC from "rage-rpc";
const player = mp.players.local;

export const getNormalizedVector = (vector: any) => {
	const mag = Math.sqrt(vector.x * vector.x + vector.y * vector.y + vector.z * vector.z);
	vector.x = vector.x / mag;
	vector.y = vector.y / mag;
	vector.z = vector.z / mag;
	return vector;
};

export const getCrossProduct = (v1: any, v2: any) => {
	let vector = new mp.Vector3(0, 0, 0);
	vector.x = v1.y * v2.z - v1.z * v2.y;
	vector.y = v1.z * v2.x - v1.x * v2.z;
	vector.z = v1.x * v2.y - v1.y * v2.x;
	return vector;
};

export const showPlayer = (bool: boolean) => {
	player.freezePosition(bool);
	player.setInvincible(bool);
	player.setVisible(!bool, false);
	player.setCollision(!bool, false);
};

export const showToast = (options: { type: "error" | "success" | "warning" | "info"; message: string; seconds: number }) => {
	RPC.triggerBrowsers("brw:showToast", options);
};
