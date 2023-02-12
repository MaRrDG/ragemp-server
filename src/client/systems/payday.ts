import { sharedVariables } from "@/events";
import * as RPC from "rage-rpc";

setInterval(() => {
	if (!sharedVariables.stats?.isLogged || !sharedVariables.stats.payCheck) return;
	sharedVariables.stats.payCheck.seconds = sharedVariables.stats.payCheck.seconds - 1;

	if (sharedVariables.stats.payCheck.seconds < 0) {
		sharedVariables.stats.payCheck.minutes = sharedVariables.stats.payCheck.minutes - 1;
		sharedVariables.stats.payCheck.seconds = 60;
	}

	if (sharedVariables.stats.payCheck.minutes < 0) {
		RPC.callServer("server:payday");
		sharedVariables.stats.payCheck.minutes = 59;
		sharedVariables.stats.payCheck.seconds = 60;
	}

	RPC.callServer("server:updatePaycheck", { minutes: sharedVariables.stats.payCheck.minutes, seconds: sharedVariables.stats.payCheck.seconds });
	RPC.triggerBrowsers("brw:updatePayCheck", {
		minutes: sharedVariables.stats.payCheck.minutes,
		seconds: sharedVariables.stats.payCheck.seconds
	});
}, 1000);
