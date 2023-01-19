import mongoose from 'mongoose';

export interface IUser {
	username: string;
	email: string;
	password: string;
	rgscId: string;
	socialClub: string;
	uuid: string;
	admin?: number;
}

const AccountsSchema = new mongoose.Schema<IUser>({
	username: { type: String, required: true, unique: true },
	email: { type: String, required: true },
	password: { type: String, required: true },
	rgscId: { type: String, required: true, unique: true },
	socialClub: { type: String, required: true, unique: true },
	uuid: { type: String, required: true, unique: true },
	admin: { type: Number, default: 0 }
});

export const AccountsModel = mongoose.model('Accounts', AccountsSchema);
