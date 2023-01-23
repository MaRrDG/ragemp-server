import "./commandHandling";
import "./loadPlayer";
import "./types";

mp.events.add("playerChat", (player, message) => {
	player.outputChatBox(`${player.name}(${player.id}): ${message}`);
});

mp.events.add("sendAllAdminMessage", (_player, message) => {
	mp.players.forEach((player) => {
		if (player.metadata.stats.admin < 1) return;
		player.sendAdminMessage(message);
	});
});
