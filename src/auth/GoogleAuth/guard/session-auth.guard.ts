import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class SessionAuthGuard implements CanActivate {
	canActivate(context: ExecutionContext): boolean {
		// Support both HTTP (REST) and GraphQL contexts
		let req: any;
		try {
			const gql = GqlExecutionContext.create(context);
			const gqlReq = gql.getContext().req;
			if (gqlReq) {
				req = gqlReq;
			}
		} catch (e) {
			// not a GraphQL context
		}

		if (!req) {
			req = context.switchToHttp().getRequest();
		}

		// Добавить логирование для отладки
		console.log('Session user:', req?.user);
		return !!req?.user;
	}
}
