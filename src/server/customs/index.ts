import "./commandHandling";
import "./loadPlayer";
import "./types";
import "./payday";

mp.events.add("playerChat", (player, message) => {
	mp.players.broadcastInRange(player.position, 25, `${player.name}(${player.id}): ${message}`);
});

mp.events.add("sendAllAdminMessage", (_player, message) => {
	mp.players.forEach((player) => {
		if (player.metadata.stats.admin < 1) return;
		player.sendAdminMessage(message);
	});
});
