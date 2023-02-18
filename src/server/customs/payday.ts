import * as RPC from "rage-rpc";

RPC.register("server:payday", (_d, info) => {
	const player = info.player as PlayerMp;
	const money = Math.floor(Math.random() * 25 + 1) * 100;
	const experience = player.metadata.stats.level * 25;
	player.metadata.stats.bankMoney = player.metadata.stats.bankMoney + money;
	player.giveExperience(experience);
	player.metadata.stats.hoursPlayed = player.metadata.stats.hoursPlayed + 1;

	RPC.triggerBrowsers(player, "brw:updateStats", {
		bankMoney: player.metadata.stats.bankMoney,
		money: player.metadata.stats.money
	});

	RPC.triggerBrowsers(player, "brw:updatePayCheck", {
		experience,
		money
	});
});

RPC.register("server:updatePaycheck", ({ minutes, seconds }, info) => {
	const player = info.player as PlayerMp;

	player.metadata.stats.payCheck.minutes = minutes;
	player.metadata.stats.payCheck.seconds = seconds;
});
