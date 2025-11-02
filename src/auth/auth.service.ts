import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/user/entities/user.entity';

@Injectable()
export class AuthService {
	constructor(
		@InjectModel(User.name) private userModel: Model<UserDocument>,
	) {}

	async validateUser(userdata: {
		email: string;
		firstName;
		lastName;
		picture: string;
	}): Promise<User> {
		const user = await this.userModel.findOne({ email: userdata.email });
		// const user = await this.userModel.findOne({ googleId: userdata.id });
		if (user) return user;

		// if (user) {
		// 	// Можно обновить имя или фото, если нужно
		// 	user.name = userdata.name;
		// 	if (userdata.picture) user.image = userdata.picture;
		// 	return user.save();
		// }

		const newUser = new this.userModel({
			email: userdata.email,
			firstName: userdata.firstName,
			lastName: userdata.lastName,
			image: userdata.picture || null,
		});

		return newUser.save();
	}
}
