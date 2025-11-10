import { Resolver, Query, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { SessionAuthGuard } from '../guard/session-auth.guard';
import { User } from 'src/user/entities/user.entity';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '../interfaces/role.interface';
import { RolesGuard } from '../guard/roles.guard';
import type { GqlContext } from 'src/auth/types/graphql-context';
import { AuthenticationError } from 'apollo-server-express';

@Resolver(() => User)
export class AuthResolver {
	@Query(() => User, { nullable: true })
	@UseGuards(SessionAuthGuard)
	async session(
		@Context() context: GqlContext,
	): Promise<Partial<User> | null> {
		if (!context.req.user) {
			// бросаем стандартную Apollo ошибку с кодом UNAUTHENTICATED
			throw new AuthenticationError('Пользователь не авторизован');
		}
		// console.log(
		// 	'AuthResolver.me - context keys:',
		// 	Object.keys(context || {}),
		// );
		// console.log('AuthResolver.me - context.req =', !!context?.req);
		// console.log('AuthResolver.me - context.req.user =', context?.req?.user);
		return context.req.user;
	}

	// резолвер с требованием роли ADMIN
	@Query(() => String)
	@UseGuards(SessionAuthGuard, RolesGuard)
	@Roles(Role.ADMIN)
	async adminRoute(@Context() context: GqlContext): Promise<string> {
		return 'Доступ только для администраторов';
	}

	// резолвер с требованиями ролей админа и модератора
	@Query(() => String)
	@UseGuards(SessionAuthGuard, RolesGuard)
	@Roles(Role.ADMIN, Role.MODERATOR)
	async moderatorRoute(@Context() context: GqlContext): Promise<string> {
		return 'Доступ для администраторов и модераторов';
	}
}
