import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UserService } from './user.service';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';
import { Schema as MongooSchema } from 'mongoose';

@Resolver('User')
export class UserResolver {
	constructor(private readonly userService: UserService) {}

	@Query(() => User, {
		name: 'userById',
		description: 'Поиск пользователя по id',
	})
	getUserById(
		@Args('id', { type: () => ID }) id: MongooSchema.Types.ObjectId,
	) {
		return this.userService.getUserById(id);
	}

	@Query(() => [User], {
		name: 'users',
		description: 'Получить всех пользователей',
	})
	getAllUsers() {
		return this.userService.getAllUsers();
	}

	@Mutation(() => User, {
		name: 'createUser',
		description: 'Создать пользователя',
	})
	createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
		return this.userService.createUser(createUserInput);
	}

	@Mutation(() => User, {
		name: 'updateUser',
		description: 'Обновить данные пользователя',
	})
	updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
		return this.userService.updateUser(
			updateUserInput._id,
			updateUserInput,
		);
	}

	@Mutation(() => User, {
		name: 'removeUser',
		description: 'Удалить пользователя',
	})
	removeUser(
		@Args('id', { type: () => ID }) id: MongooSchema.Types.ObjectId,
	) {
		return this.userService.removeUser(id);
	}
}
