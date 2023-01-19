import { WEATHERS } from './../../../../shared/weathers';
import { VEHICLE_HASES } from '@shared/vehicleHashes';
import { generateRandomRGBColorAsArray } from '@shared/utils';
import { addNewCommand } from '@/customs/commandHandling';
import * as rpc from 'rage-rpc';

addNewCommand({
	commandName: 'spawncar',
	alias: ['veh', 'spawnveh'],
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
	inVehicle: true,
	callback: (player) => {
		player.vehicle.repair();
		player.sendSuccessMessage('Your vehicle has been repaired!');
	}
});

addNewCommand({
	commandName: 'settime',
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
	alias: ['setw'],
	callback: (player, weather) => {
		if (!WEATHERS.includes(weather.toLocaleUpperCase()) || !weather) return player.sendErrorMessage(`Weather should be: ${WEATHERS.join(', ')}`);

		mp.world.weather = weather;

		if (player.vars.snow && ['SNOW', 'BLIZZARD', 'SNOWLIGHT', 'XMAS'].includes(weather.toLocaleUpperCase())) {
			rpc.callClient(player, 'toggleSnow', player.vars.snow);
		}

		player.sendSuccessMessage('Weather changed successfully');
	}
});
