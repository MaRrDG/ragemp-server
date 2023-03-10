import { WEATHERS } from "@shared/weathers";
import { VEHICLE_HASES } from "@shared/vehicleHashes";
import { generateRandomRGBColorAsArray } from "@shared/utils";
import { addNewCommand } from "@/customs/commandHandling";
import * as rpc from "rage-rpc";
import fs from "fs";

addNewCommand({
	commandName: "savepos",
	adminLvl: 4,
	callback: async (player, name) => {
		const { position, direction } = await rpc.callClient(player, "client:getCamPos");
		const playerPosition = player.position;

		fs.appendFile(
			"savedPositions.txt",
			`Name: ${name ? name : "undefined"} 
			Player position: ${JSON.stringify(playerPosition)} 
			Camera details: { 
				position: ${JSON.stringify(position)} 
				direction: ${JSON.stringify(direction)} 
			}
			\r\n`,
			(err) => {
				if (err) return player.showToast({ type: "error", message: "Position could not be saved!", seconds: 1500 });
				player.showToast({ type: "success", message: "Position saved!", seconds: 1500 });
			}
		);
	}
});

addNewCommand({
	commandName: "spawncar",
	alias: ["veh", "spawnveh"],
	adminLvl: 1,
	callback: (player, vehicle) => {
		if (!vehicle) return player.sendErrorMessage("You need to type some vehicle to spawn it!");
		if (!VEHICLE_HASES[vehicle]) return player.sendErrorMessage("This vehicle doesn't exists!");

		const adminVehicle: VehicleMp = mp.vehicles.new(mp.joaat(vehicle), player.position, {
			numberPlate: "ADMIN",
			color: [generateRandomRGBColorAsArray(), generateRandomRGBColorAsArray()]
		});

		adminVehicle.dimension = player.dimension;
		adminVehicle.typeOf = "admin";

		player.putIntoVehicle(adminVehicle, 0);
		player.sendSuccessMessage("Your vehicle has been spawned!");
	}
});

addNewCommand({
	commandName: "vre",
	alias: ["dv"],
	adminLvl: 1,
	inVehicle: true,
	callback: (player) => {
		if (player.vehicle.typeOf === "admin") {
			player.vehicle.destroy();
		}

		player.sendSuccessMessage("Your vehicle has been destroyed!");
	}
});

addNewCommand({
	commandName: "fv",
	adminLvl: 1,
	inVehicle: true,
	callback: (player) => {
		player.vehicle.repair();
		player.sendSuccessMessage("Your vehicle has been repaired!");
	}
});

addNewCommand({
	commandName: "carcolor",
	alias: ["vcolor", "vehiclecolor"],
	adminLvl: 1,
	inVehicle: true,
	callback: (player, fullText, color1, color2) => {
		if (!color1 || !color2 || isNaN(color1) || isNaN(color2)) return player.sendErrorMessage("You need to put color1 & color2.");
		player.vehicle.setColor(parseInt(color1), parseInt(color2));
		player.sendSuccessMessage("Your vehicle has been resprayed!");
	}
});

addNewCommand({
	commandName: "settime",
	adminLvl: 1,
	alias: ["sett"],
	callback: (player, time) => {
		const newWorldTime = parseInt(time);
		if (!time || newWorldTime < 0 || newWorldTime > 24 || isNaN(time as any)) return player.sendErrorMessage("You need to put time between 0 and 24.");

		mp.world.time.hour = newWorldTime;
		player.sendSuccessMessage("Time changed successfully");
	}
});

addNewCommand({
	commandName: "setweather",
	adminLvl: 1,
	alias: ["setw"],
	callback: (player, weather) => {
		if (!WEATHERS.includes(weather.toLocaleUpperCase()) || !weather) return player.sendErrorMessage(`Weather should be: ${WEATHERS.join(", ")}`);
		mp.world.weather = weather;
		player.sendSuccessMessage("Weather changed successfully");
	}
});

addNewCommand({
	commandName: "setadmin",
	adminLvl: 5,
	haveTarget: {
		active: true,
		syntaxMessage: "/setadmin [playerID] [level 1-6] [reason]"
	},
	callback: (player, fullText, target, level, ...reason) => {
		if (!level || reason.length < 1) return player.sendSyntaxMessage("/setadmin [playerID] [level 1-6] [reason]");
		let playerTarget = mp.players.at(target);
		let fullReason = reason.join(" ");

		playerTarget.metadata.stats.admin = level;
		playerTarget.outputChatBox(`Admin ${player.name} changed your admin level to ${level} for ${fullReason}`);
		player.sendSuccessMessage(`You changed admin level to ${level} for ${fullReason}`);
		mp.events.call("sendAllAdminMessage", player, `Admin ${player.name} changed admin level for ${playerTarget.name} to level ${level}.`);
	}
});

addNewCommand({
	commandName: "goto",
	adminLvl: 1,
	haveTarget: {
		active: true,
		syntaxMessage: "/goto [playerID]"
	},
	callback: (player, fullText, target) => {
		let playerTarget = mp.players.at(target);
		const playerTargetPosition = new mp.Vector3(playerTarget.position.x, playerTarget.position.y, playerTarget.position.z + 2);

		player.position = playerTargetPosition;
		if (player.vehicle) {
			player.vehicle.position = playerTargetPosition;
			player.putIntoVehicle(player.vehicle, 0);
		}
		player.sendSuccessMessage(`You teleported to player with id ${target}`);
	}
});

addNewCommand({
	commandName: "gethere",
	adminLvl: 1,
	haveTarget: {
		active: true,
		syntaxMessage: "/gethere [playerID]"
	},
	callback: (player, fullText, target) => {
		let playerTarget = mp.players.at(target);
		const playerPosition = new mp.Vector3(player.position.x, player.position.y, player.position.z + 2);

		playerTarget.position = playerPosition;
		if (playerTarget.vehicle) {
			playerTarget.vehicle.position = playerPosition;
			playerTarget.putIntoVehicle(playerTarget.vehicle, 0);
		}
		player.sendSuccessMessage(`You teleported player to you with id ${target}`);
	}
});
