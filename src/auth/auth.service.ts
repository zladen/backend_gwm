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
		firstName: string;
		lastName: string;
		picture: string;
	}): Promise<User> {
		const user = await this.userModel.findOne({ email: userdata.email });

		if (user) return user;

		const newUser = new this.userModel({
			email: userdata.email,
			firstName: userdata.firstName,
			lastName: userdata.lastName,
			image: userdata.picture || '',
		});

		return newUser.save();
	}
}
