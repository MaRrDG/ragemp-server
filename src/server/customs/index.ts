import './commandHandling';
import './loadPlayer';
import './types';

mp.events.add('playerChat', (player, message) => {
	player.outputChatBox(`${player.name}(${player.id}): ${message}`);
});
