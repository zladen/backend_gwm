import {
	Injectable,
	CanActivate,
	ExecutionContext,
	ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../interfaces/role.interface';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { GqlExecutionContext } from '@nestjs/graphql';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
	constructor(private reflector: Reflector) {}

	canActivate(context: ExecutionContext): boolean {
		const requiredRoles = this.reflector.getAllAndOverride<Role[]>(
			ROLES_KEY,
			[context.getHandler(), context.getClass()],
		);

		if (!requiredRoles) {
			return true;
		}

		const ctx = GqlExecutionContext.create(context);

		const request = ctx.getContext().req;

		const user = request.user as User;

		if (!user || !user.roles || !Array.isArray(user.roles)) {
			throw new ForbiddenException('У вас не достаточно прав');
		}

		const hasRole = requiredRoles.some((role) => user.roles.includes(role));

		if (!hasRole) {
			throw new ForbiddenException('У вас не достаточно прав');
		}
		return true;
	}
}
