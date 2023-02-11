import mongoose from "mongoose";

export interface IUser {
	username: string;
	email: string;
	password: string;
	rgscId: string;
	socialClub: string;
	uuid: string;
	stats: {
		admin: number;
		helper: number;
		money: number;
		bankMoney: number;
		level: number;
		hoursPlayed: number;
		points: {
			experience: number;
		};
		payCheck: {
			minutes: number;
			seconds: number;
		};
		isLogged: boolean;
	};
}

const AccountsSchema = new mongoose.Schema<IUser>({
	username: { type: String, required: true, unique: true },
	email: { type: String, required: true },
	password: { type: String, required: true },
	rgscId: { type: String, required: true },
	socialClub: { type: String, required: true },
	uuid: { type: String, required: true },
	stats: {
		admin: { type: Number, default: 0 },
		helper: { type: Number, default: 0 },
		money: { type: Number, default: 0 },
		bankMoney: { type: Number, default: 0 },
		level: { type: Number, default: 1 },
		hoursPlayed: { type: Number, default: 0 },
		points: {
			experience: { type: Number, default: 0 }
		},
		payCheck: {
			minutes: { type: Number, default: 60 },
			seconds: { type: Number, default: 60 }
		},
		isLogged: { type: Boolean, default: false }
	}
});

export const AccountsModel = mongoose.model("Accounts", AccountsSchema);
