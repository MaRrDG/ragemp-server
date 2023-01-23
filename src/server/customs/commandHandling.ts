import { rageConsole } from "@shared/utils";

export type ICommands = {
	commandName: string;
	alias?: string[];
	inVehicle?: boolean;
	adminLvl?: number;
	haveTarget?: {
		active?: boolean;
		syntaxMessage?: string;
	};
	callback: (player: PlayerMp, fullText: string, ...args: any) => void;
};

const commandsList: ICommands[] = [];

export const addNewCommand = (props: ICommands) => {
	commandsList.push(props);
};

mp.events.add("playerCommand", (player, message) => {
	try {
		if (player.vars.loadPlayerInfo) return;

		message = message.trim();
		const commandArgs = message.split(/ +/);
		const commandName = commandArgs.shift() || "";
		const fullText = message.substring(commandName.length + 1);

		const command = commandsList.find((elem) => {
			const aliasFound = elem.alias?.find((e) => e === commandName);
			return aliasFound ? elem : elem.commandName === commandName;
		});

		if (!command) return player.sendErrorMessage("No command was found! Type /help for more commands.");

		if (command.haveTarget?.active) {
			let playerTarget = mp.players.at(parseInt(commandArgs[0]));

			if ((command.haveTarget.syntaxMessage && !commandArgs[0]) || isNaN(commandArgs[0] as any))
				return player.sendSyntaxMessage(command.haveTarget.syntaxMessage || "");
			if (!playerTarget) return player.sendErrorMessage("Player not online.");
			if (player.id === playerTarget.id) return player.sendErrorMessage("You can't use this command on yourself.");
		}

		if (command.adminLvl && command.adminLvl > player.metadata.stats.admin) return player.sendErrorMessage("You don't have access to use this command.");

		if (command.inVehicle && !player.vehicle) return player.sendErrorMessage("You need to be in vehicle to use this command!");

		command.callback(player, fullText, ...commandArgs);
	} catch (e) {
		return rageConsole.error(e);
	}
});

setTimeout(() => {
	rageConsole.load(`Loaded ${commandsList.length} commands.`);
}, 1000);
