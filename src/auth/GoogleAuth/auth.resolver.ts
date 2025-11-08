import { Resolver, Query, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { SessionAuthGuard } from './guard/session-auth.guard';
import { User } from 'src/user/entities/user.entity';
import { Roles } from './decorators/roles.decorator';
import { Role } from './interfaces/role.interface';
import { RolesGuard } from './guard/roles.guard';

@Resolver(() => User)
export class AuthResolver {
	@Query(() => User)
	@UseGuards(SessionAuthGuard)
	async me(@Context() context: any) {
		console.log(
			'AuthResolver.me - context keys:',
			Object.keys(context || {}),
		);
		console.log('AuthResolver.me - context.req =', !!context?.req);
		console.log('AuthResolver.me - context.req.user =', context?.req?.user);
		return context.req.user;
	}

	// Пример резолвера с требованием роли ADMIN
	@Query(() => String)
	@UseGuards(SessionAuthGuard, RolesGuard)
	@Roles(Role.ADMIN)
	async adminRoute(@Context() context: any) {
		return 'Доступ только для администраторов';
	}

	// Пример резолвера с множественными ролями
	@Query(() => String)
	@UseGuards(SessionAuthGuard, RolesGuard)
	@Roles(Role.ADMIN, Role.MODERATOR)
	async moderatorRoute(@Context() context: any) {
		return 'Доступ для администраторов и модераторов';
	}
}
