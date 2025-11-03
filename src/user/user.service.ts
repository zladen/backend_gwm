import { Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './entities/user.entity';
import { Model, Schema as MongooSchema } from 'mongoose';

@Injectable()
export class UserService {
	constructor(
		@InjectModel(User.name)
		private userModel: Model<UserDocument>,
	) {}

	getAllUsers() {
		return this.userModel.find();
	}

	getUserById(id: MongooSchema.Types.ObjectId) {
		return this.userModel.findById(id);
	}

	createUser(createUserInput: CreateUserInput) {
		const createUser = new this.userModel(createUserInput);
		return createUser.save();
	}

	updateUser(
		id: MongooSchema.Types.ObjectId,
		updateUserInput: UpdateUserInput,
	) {
		return this.userModel.findByIdAndUpdate(id, updateUserInput, {
			new: true,
		});
	}

	removeUser(id: MongooSchema.Types.ObjectId) {
		return this.userModel.deleteOne({ _id: id });
	}
}
