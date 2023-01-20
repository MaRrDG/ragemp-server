import { GlobalService } from './globalService';
import { rageConsole } from '@shared/utils';
import { AccountsModel, IUser } from './../models/userModel';

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

	public async getEntityByProperty({ property }: { property: { [key: string]: string } }) {
		try {
			const user = await AccountsModel.findOne({ property }).exec();
			if (!user) return undefined;

			return user;
		} catch (e) {
			return rageConsole.error(e);
		}
	}

	public async postEntity({ entity }: { entity: IUser }) {
		try {
			await AccountsModel.create(entity);
			rageConsole.query(`A new account has been added with rgscId: ${entity.rgscId}`);
		} catch (e) {
			return rageConsole.error(e);
		}
	}

	public async putEntity({ username, entity }: { username: string; entity: IUser }) {
		const account = new AccountsModel(entity);
		const validation = account.validateSync();

		if (validation?.errors) return rageConsole.error('Missing required fields');

		try {
			AccountsModel.findOneAndUpdate({ username: username }, entity).exec();
		} catch (e) {
			rageConsole.error(e);
		}
	}
}
