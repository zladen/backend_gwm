import { Resolver, Query, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { SessionAuthGuard } from './guard/session-auth.guard';
import { User } from 'src/user/entities/user.entity';

@Resolver(() => User)
export class AuthResolver {
	@Query(() => User)
	@UseGuards(SessionAuthGuard)
	async me(@Context() context: any) {
		console.log('AuthResolver.me - context keys:', Object.keys(context || {}));
		console.log('AuthResolver.me - context.req =', !!context?.req);
		console.log('AuthResolver.me - context.req.user =', context?.req?.user);
		return context.req.user;
	}
}
