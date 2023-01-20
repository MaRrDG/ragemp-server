import { WEATHERS } from './../../../../shared/weathers';
import { VEHICLE_HASES } from '@shared/vehicleHashes';
import { generateRandomRGBColorAsArray } from '@shared/utils';
import { addNewCommand } from '@/customs/commandHandling';
import * as rpc from 'rage-rpc';

addNewCommand({
	commandName: 'spawncar',
	alias: ['veh', 'spawnveh'],
	adminLvl: 1,
	callback: function (player, vehicle) {
		if (!vehicle) return player.sendErrorMessage('You need to type some vehicle to spawn it!');
		if (!VEHICLE_HASES[vehicle]) return player.sendErrorMessage("This vehicle doesn't exists!");

		const adminVehicle: VehicleMp = mp.vehicles.new(mp.joaat(vehicle), player.position, {
			numberPlate: 'ADMIN',
			color: [generateRandomRGBColorAsArray(), generateRandomRGBColorAsArray()]
		});

		adminVehicle.dimension = player.dimension;
		adminVehicle.typeOf = 'admin';

		player.putIntoVehicle(adminVehicle, 0);
		player.sendSuccessMessage('Your vehicle has been spawned!');
	}
});

addNewCommand({
	commandName: 'vre',
	alias: ['dv'],
	adminLvl: 1,
	inVehicle: true,
	callback: (player) => {
		if (player.vehicle.typeOf === 'admin') {
			player.vehicle.destroy();
		}

		player.sendSuccessMessage('Your vehicle has been destroyed!');
	}
});

addNewCommand({
	commandName: 'fv',
	adminLvl: 1,
	inVehicle: true,
	callback: (player) => {
		player.vehicle.repair();
		player.sendSuccessMessage('Your vehicle has been repaired!');
	}
});

addNewCommand({
	commandName: 'carcolor',
	alias: ['vcolor', 'vehiclecolor'],
	adminLvl: 1,
	inVehicle: true,
	callback: (player, fullText, color1, color2) => {
		if (!color1 || !color2 || isNaN(color1) || isNaN(color2)) return player.sendErrorMessage('You need to put color1 & color2.');
		player.vehicle.setColor(parseInt(color1), parseInt(color2));
		player.sendSuccessMessage('Your vehicle has been resprayed!');
	}
});

addNewCommand({
	commandName: 'settime',
	adminLvl: 1,
	alias: ['sett'],
	callback: (player, time) => {
		const newWorldTime = parseInt(time);
		if (!time || newWorldTime < 0 || newWorldTime > 24 || isNaN(time as any))
			return player.sendErrorMessage('You need to put time between 0 and 24.');

		mp.world.time.hour = newWorldTime;
		player.sendSuccessMessage('Time changed successfully');
	}
});

addNewCommand({
	commandName: 'setweather',
	adminLvl: 1,
	alias: ['setw'],
	callback: (player, weather) => {
		if (!WEATHERS.includes(weather.toLocaleUpperCase()) || !weather) return player.sendErrorMessage(`Weather should be: ${WEATHERS.join(', ')}`);

		mp.world.weather = weather;

		if (['SNOW', 'BLIZZARD', 'SNOWLIGHT', 'XMAS'].includes(weather.toLocaleUpperCase())) {
			mp.players.forEach((elem) => {
				rpc.callClient(elem, 'toggleSnow', elem.vars.snow);
			});
		}

		player.sendSuccessMessage('Weather changed successfully');
	}
});

addNewCommand({
	commandName: 'setadmin',
	adminLvl: 5,
	callback: (player, fullText, target, level, ...reason) => {
		let playerTarget = mp.players.at(target);
		let fullReason = reason.join(' ');
		if (!target || isNaN(target)) return player.sendErrorMessage('Syntax: /setadmin [playerID] [level 1-6] [reason]');
		if (!playerTarget) return player.sendErrorMessage('Player not online.');

		playerTarget.metadata.stats.admin = level;
		playerTarget.outputChatBox(`Admin ${player.name} changed your admin level to ${level} for ${fullReason}`);
		// TODO: Mesaje catre toti adminii si o functie speciala pentru Syntax:
		player.sendSuccessMessage(`You changed admin level to ${level} for ${fullReason}`);
	}
});

addNewCommand({
	commandName: 'goto',
	adminLvl: 1,
	callback: (player, fullText, target) => {
		let playerTarget = mp.players.at(target);
		if (!target || isNaN(target)) return player.sendErrorMessage('Syntax: /goto [playerID]');
		if (!playerTarget) return player.sendErrorMessage('Player not online.');
		if (player.id === playerTarget.id) return player.sendErrorMessage("You can't use this command on yourself.");

		player.position = playerTarget.position;
		player.sendSuccessMessage(`You teleported to player with id ${target}`);
	}
});

addNewCommand({
	commandName: 'gethere',
	adminLvl: 1,
	callback: (player, fullText, target) => {
		let playerTarget = mp.players.at(target);
		if (!target || isNaN(target)) return player.sendErrorMessage('Syntax: /gethere [playerID]');
		if (!playerTarget) return player.sendErrorMessage('Player not online.');
		if (player.id === playerTarget.id) return player.sendErrorMessage("You can't use this command on yourself.");

		playerTarget.position = player.position;
		player.sendSuccessMessage(`You teleported player to you with id ${target}`);
	}
});
