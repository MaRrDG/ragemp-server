import { GlobalService } from "./globalService";
import { rageConsole } from "@shared/utils";
import { AccountsModel, IUser } from "./../models/userModel";
import { DeepPartial } from "@/@types";

// TODO: Error handling mai bun

export class AccountsService implements GlobalService {
	public async getEntities() {
		try {
			const accounts = await AccountsModel.find().exec();
			return accounts;
		} catch (e) {
			return rageConsole.error(e);
		}
	}

	public async getEntityByUsername({ username }: { username: string }) {
		try {
			const user = await AccountsModel.findOne({ username: username }).exec();
			if (!user) return undefined;

			return user;
		} catch (e) {
			return rageConsole.error(e);
		}
	}

	public async postEntity({ entity }: { entity: Omit<IUser, "stats"> }) {
		try {
			await AccountsModel.create(entity);
			rageConsole.query(`A new account has been added with username: ${entity.username}`);
		} catch (e) {
			return rageConsole.error(e);
		}
	}

	public async putEntity({ username, entity }: { username: string; entity: IUser }) {
		const account = new AccountsModel(entity);
		const validation = account.validateSync();

		if (validation?.errors) return rageConsole.error("Missing required fields");

		try {
			AccountsModel.findOneAndUpdate({ username: username }, entity).exec();
		} catch (e) {
			rageConsole.error(e);
		}
	}

	public async patchEntity({ username, entity }: { username: string; entity: DeepPartial<IUser> }) {
		try {
			AccountsModel.findOneAndUpdate({ username: username }, { $set: entity }, { upsert: true, new: true }).exec();
		} catch (e) {
			rageConsole.error(e);
		}
	}
}
