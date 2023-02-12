import * as RPC from "rage-rpc";

mp.Player.prototype.giveExperience = function (experience: number) {
	this.metadata.stats.points.experience = this.metadata.stats.points.experience + experience;
	const newLevel = this.metadata.stats.level + 1;

	if (this.metadata.stats.points.experience > this.metadata.stats.level * 250) {
		this.metadata.stats.level = newLevel;
		this.metadata.stats.points.experience = 0;
		this.outputChatBox(`You advance to level !{#6366f1}${this.metadata.stats.level}!{#ffffff}, congratulations!`);
	}
	RPC.triggerBrowsers(this, "brw:updateStats", {
		points: {
			experience: this.metadata.stats.points.experience
		},
		level: newLevel
	});
};

declare global {
	interface VehicleMp {
		typeOf: string;
	}

	interface PlayerMp {
		giveExperience: (experience: number) => void;
	}
}

export {};
