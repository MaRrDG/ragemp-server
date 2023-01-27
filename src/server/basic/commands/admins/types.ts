mp.Player.prototype.sendErrorMessage = function (message: string) {
	this.outputChatBox(`!{#ff0000}ERROR!{#ffffff}: ${message}`);
};

mp.Player.prototype.sendSuccessMessage = function (message: string) {
	this.outputChatBox(`!{#00d41c}SUCCESS!{#ffffff}: ${message}`);
};

mp.Player.prototype.sendSyntaxMessage = function (message: string) {
	this.outputChatBox(`!{#737373}SYNTAX!{#ffffff}: ${message}`);
};

mp.Player.prototype.sendAdminMessage = function (message: string) {
	this.outputChatBox(`!{#730000}(a_chat)!{#ffffff}: ${message}`);
};

declare global {
	interface VehicleMp {
		typeOf: string;
	}

	interface PlayerMp {
		sendErrorMessage: (message: string) => void;
		sendSuccessMessage: (message: string) => void;
		sendSyntaxMessage: (message: string) => void;
		sendAdminMessage: (message: string) => void;
	}
}

export {};
