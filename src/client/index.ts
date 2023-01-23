import "./randomStuff";
import "./browsers";
import "./events";
import { CONFIG } from "./config";

mp.gui.chat.show(false);
const browser = mp.browsers.new(CONFIG.React_URL);
browser.markAsChat();
