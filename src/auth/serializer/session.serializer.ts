import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/user/entities/user.entity';

@Injectable()
export class SessionSerializer {
	constructor(
		@InjectModel(User.name) private userModel: Model<UserDocument>,
	) {}

	serializeUser(user: any, done: Function) {
		done(null, user._id); // сохраняем только ID в сессии
	}

	async deserializeUser(id: string, done: Function) {
		try {
			const user = await this.userModel.findById(id);

			const userSession = {
				_id: user?._id,
				email: user?.email,
				firstName: user?.firstName,
				lastName: user?.lastName,
				roles: user?.roles,
			};

			// console.log(
			// 	'SessionSerializer.deserializeUser - id=',
			// 	id,
			// 	'found=',
			// 	!!user,
			// 	user && user.email,
			// );

			done(null, userSession);
		} catch (err) {
			done(err, null);
		}
	}
}
