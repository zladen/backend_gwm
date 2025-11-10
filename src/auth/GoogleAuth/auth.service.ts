import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/user/entities/user.entity';
import { Role } from '../interfaces/role.interface';

@Injectable()
export class AuthService {
	constructor(
		@InjectModel(User.name) private userModel: Model<UserDocument>,
	) {}

	async validateUser(userdata: {
		firstName: string;
		lastName: string;
		image: string;
		email: string;
		roles?: Role[];
	}): Promise<User> {
		const user = await this.userModel.findOne({ email: userdata.email });

		if (user) return user;

		const newUser = new this.userModel({
			firstName: userdata.firstName,
			lastName: userdata.lastName,
			image: userdata.image || '',
			email: userdata.email,
			roles: [Role.USER],
		});

		return newUser.save();
	}

	async assignRole(userId: string, role: Role): Promise<User> {
		const user = await this.userModel.findById(userId);

		if (!user) {
			throw new Error('Пользователь не найден');
		}

		// Добавляем роль в массив ролей
		if (!user.roles.includes(role)) {
			user.roles.push(role);
		}

		return user.save();
	}

	async removeRole(userId: string, role: Role): Promise<User> {
		const user = await this.userModel.findById(userId);

		if (!user) {
			throw new Error('Пользователь не найден');
		}

		// Удаляем роль из массива ролей
		user.roles = user.roles.filter((r) => r !== role);

		return user.save();
	}

	async setAdminRole(email: string): Promise<User> {
		const user = await this.userModel.findOne({ email });

		if (!user) {
			throw new Error('Пользователь не найден');
		}

		// Устанавливаем админку
		if (!user.roles.includes(Role.ADMIN)) {
			user.roles.push(Role.ADMIN);
		}

		return user.save();
	}
}
