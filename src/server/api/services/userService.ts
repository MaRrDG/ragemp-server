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

	public async getEntityById({ id }: { id: string }) {
		try {
			const user = await AccountsModel.findById(id).exec();
			if (!user) return undefined;

			return user;
		} catch (e) {
			return rageConsole.error(e);
		}
	}

	public async getEntityByRockstarId({ id }: { id: string }) {
		try {
			const user = await AccountsModel.findOne({ rgscId: id }).exec();
			if (!user) return undefined;

			return user;
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

	public async postEntity({ entity }: { entity: IUser }) {
		try {
			await AccountsModel.create(entity);
			rageConsole.query(`A new account has been added with rgscId: ${entity.rgscId}`);
		} catch (e) {
			return rageConsole.error(e);
		}
	}

	public async putEntity({ id, entity }: { id: string; entity: IUser }) {
		const account = new AccountsModel(entity);
		const validation = account.validateSync();

		if (validation?.errors) return rageConsole.error('Missing required fields');

		try {
			AccountsModel.findOneAndUpdate({ rgscId: id }, entity).exec();
		} catch (e) {
			rageConsole.error(e);
		}
	}
}
