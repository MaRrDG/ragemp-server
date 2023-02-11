import { sharedVariables } from "../events";
import { getCrossProduct, getNormalizedVector, showPlayer, showToast } from "@/utils";

const bindVirtualKeys = {
	F2: 0x71
};

const bindASCIIKeys = {
	Q: 69,
	E: 81,
	LCtrl: 17,
	Shift: 16
};

let isNoClip = false;
let noClipCamera: any;
let shiftModifier = false;
let controlModifier = false;
const player = mp.players.local;

mp.keys.bind(bindVirtualKeys.F2, true, () => {
	if (sharedVariables.haveInterfaceOpen || (sharedVariables.stats && sharedVariables.stats.admin < 1)) return;

	isNoClip = !isNoClip;
	mp.game.ui.displayRadar(!isNoClip);
	goNoClip(isNoClip);
});

const goNoClip = (isNoClip: boolean) => {
	if (sharedVariables.haveInterfaceOpen) return;

	if (isNoClip) {
		const camPos = new mp.Vector3(player.position.x, player.position.y, player.position.z);
		const camRot = mp.game.cam.getGameplayCamRot(2);

		noClipCamera = mp.cameras.new("default", camPos, camRot, 45);
		noClipCamera.setActive(true);
	} else {
		if (noClipCamera) {
			const cameraPos = noClipCamera.getCoord();
			player.position = new mp.Vector3(cameraPos.x, cameraPos.y, mp.game.gameplay.getGroundZFor3dCoord(cameraPos.x, cameraPos.y, cameraPos.z, false, false));
			player.setHeading(noClipCamera.getRot(2).z);
			noClipCamera.destroy(true);
			noClipCamera = null;
		}
	}

	showToast({ type: "info", seconds: 1500, message: `Noclip ${isNoClip ? "activated" : "deactivated"}!` });
	mp.game.cam.renderScriptCams(isNoClip, false, 0, true, false);
	showPlayer(isNoClip);
};

mp.events.add("render", function () {
	if (!noClipCamera || mp.gui.cursor.visible || sharedVariables.haveInterfaceOpen) return;
	const rightAxisX = mp.game.controls.getDisabledControlNormal(0, 220);
	const rightAxisY = mp.game.controls.getDisabledControlNormal(0, 221);
	const leftAxisX = mp.game.controls.getDisabledControlNormal(0, 218);
	const leftAxisY = mp.game.controls.getDisabledControlNormal(0, 219);
	const rot = noClipCamera.getRot(2);
	const pos = noClipCamera.getCoord();
	const rr = noClipCamera.getDirection();
	const vector = new mp.Vector3(0, 0, 0);
	const upVector = new mp.Vector3(0, 0, 1);
	const rightVector = getCrossProduct(getNormalizedVector(rr), getNormalizedVector(upVector));
	let upMovement = 0.0;
	let downMovement = 0.0;
	let fastMult = 1;
	let slowMult = 1;

	controlModifier = mp.keys.isDown(bindASCIIKeys.LCtrl);
	shiftModifier = mp.keys.isDown(bindASCIIKeys.Shift);

	if (shiftModifier) {
		fastMult = 3;
	} else if (controlModifier) {
		slowMult = 0.5;
	}

	vector.x = rr.x * leftAxisY * fastMult * slowMult;
	vector.y = rr.y * leftAxisY * fastMult * slowMult;
	vector.z = rr.z * leftAxisY * fastMult * slowMult;

	rightVector.x *= leftAxisX * 0.5;
	rightVector.y *= leftAxisX * 0.5;
	rightVector.z *= leftAxisX * 0.5;

	if (mp.keys.isDown(bindASCIIKeys.Q)) {
		upMovement = 0.5;
	}

	if (mp.keys.isDown(bindASCIIKeys.E)) {
		downMovement = 0.5;
	}

	mp.players.local.position = new mp.Vector3(pos.x + vector.x + 1, pos.y + vector.y + 1, pos.z + vector.z + 1);
	mp.players.local.heading = rr.z;
	noClipCamera.setCoord(pos.x - vector.x + rightVector.x, pos.y - vector.y + rightVector.y, pos.z - vector.z + rightVector.z + upMovement - downMovement);
	noClipCamera.setRot(rot.x + rightAxisY * -5.0, 0.0, rot.z + rightAxisX * -5.0, 2);
});
