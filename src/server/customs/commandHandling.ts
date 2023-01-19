import { rageConsole } from '@shared/utils';

export type ICommands = {
	commandName: string;
	alias?: string[];
	inVehicle?: boolean;
	callback: (player: PlayerMp, fullText: string, ...args: string[]) => void;
};

const commandsList: ICommands[] = [];

export const addNewCommand = (props: ICommands) => {
	commandsList.push(props);
};

mp.events.add('playerCommand', (player, message) => {
	try {
		if (player.vars.loadPlayerInfo) return;

		message = message.trim();
		const commandArgs = message.split(/ +/);
		const commandName = commandArgs.shift() || '';
		const fullText = message.substring(commandName.length + 1);

		const command = commandsList.find((elem) => {
			const aliasFound = elem.alias?.find((e) => e === commandName);
			return aliasFound ? elem : elem.commandName === commandName;
		});

		if (!command) return player.sendErrorMessage('No command was found! Type /help for more commands.');
		if (command.inVehicle && !player.vehicle) return player.sendErrorMessage('You need to be in vehicle to use this command!');

		command.callback(player, fullText, ...commandArgs);
	} catch (e) {
		return rageConsole.error(e);
	}
});

setTimeout(() => {
	rageConsole.load(`Loaded ${commandsList.length} commands.`);
}, 1000);
