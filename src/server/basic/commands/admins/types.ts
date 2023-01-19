mp.Player.prototype.sendErrorMessage = function (message: string) {
	this.outputChatBox(`!{#ff0000}ERROR!{#ffffff}: ${message}`);
};

mp.Player.prototype.sendSuccessMessage = function (message: string) {
	this.outputChatBox(`!{#00d41c}SUCCESS!{#ffffff}: ${message}`);
};

declare global {
	interface VehicleMp {
		typeOf: string;
	}

	interface PlayerMp {
		sendErrorMessage: (message: string) => void;
		sendSuccessMessage: (message: string) => void;
	}
}

export {};
