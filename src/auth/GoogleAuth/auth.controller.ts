import {
	Controller,
	ForbiddenException,
	Get,
	Param,
	Req,
	Res,
	UseGuards,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { GoogleOAuthGuard } from '../GoogleAuth/guard/google-oauth.guard';
import { SessionAuthGuard } from '../GoogleAuth/guard/session-auth.guard';
import { Roles } from './decorators/roles.decorator';
import { Role } from './interfaces/role.interface';
import { RolesGuard } from './guard/roles.guard';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { Schema as MongooSchema } from 'mongoose';

@Controller('auth')
export class AuthController {
	constructor(private readonly userService: UserService) {}

	@Get('google')
	@UseGuards(GoogleOAuthGuard)
	googleAuth() {
		// редирект на Google
	}

	@Get('google/callback')
	@UseGuards(GoogleOAuthGuard)
	async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
		// req.user уже есть после авторизации через Google
		console.log('google callback req.user =', (req as any).user);
		const user = (req as any).user;

		return new Promise((resolve) => {
			(req as any).logIn(user, (err: any) => {
				if (err) {
					console.error('req.logIn error', err);
					res.redirect('http://localhost:5173/auth/profile');
					return resolve(null);
				}
				// сохраняем сессию перед редиректом
				req.session.save((saveErr: any) => {
					if (saveErr) console.error('session save error', saveErr);
					console.log(
						'session saved, session.passport =',
						(req as any).session?.passport,
					);
					res.redirect('http://localhost:5173/auth/profile');
					return resolve(null);
				});
			});
		});
	}

	// @Get('profile')
	// @UseGuards(SessionAuthGuard)
	// getProfile(@Req() req: Request) {
	// 	return req.user;
	// }

	// 🔓 Публичный профиль - доступен всем авторизованным пользователям
	@Get('profile/:user_id/public')
	@UseGuards(SessionAuthGuard)
	async getPublicProfile(@Param('id') id: MongooSchema.Types.ObjectId) {
		return this.userService.getPublicProfile(id);
	}

	@Get('profile/:user_id/private')
	@UseGuards(SessionAuthGuard, RolesGuard)
	@Roles(Role.USER, Role.ADMIN)
	async getProfileById(
		@Param('id') id: MongooSchema.Types.ObjectId,
		@Req() req: Request,
	) {
		const currentUser = req.user as User;

		// Проверяем, имеет ли пользователь доступ к этому профилю
		if (currentUser._id !== id && !currentUser.roles.includes(Role.ADMIN)) {
			throw new ForbiddenException(
				'Нет прав для просмотра этого профиля',
			);
		}

		return this.userService.getUserById(id);
	}

	// Diagnostic endpoint: returns req.user and session info (no guard)
	// @Get('session-check')
	// sessionCheck(@Req() req: Request) {
	// 	console.log('session-check - req.user =', (req as any).user);
	// 	console.log('session-check - req.sessionID =', (req as any).sessionID);
	// 	console.log(
	// 		'session-check - req.session =',
	// 		JSON.stringify((req as any).session || {}),
	// 	);
	// 	console.log(
	// 		'session-check - req.session.passport =',
	// 		(req as any).session?.passport,
	// 	);
	// 	return {
	// 		user: (req as any).user || null,
	// 		sessionID: (req as any).sessionID || null,
	// 		session: (req as any).session || null,
	// 	};
	// }

	// Diagnostic endpoint: protected by session guard
	// @Get('session-protected')
	// @UseGuards(SessionAuthGuard)
	// sessionProtected(@Req() req: Request) {
	// 	console.log('session-protected - req.user =', (req as any).user);
	// 	return { ok: true, user: (req as any).user };
	// }

	@Get('logout')
	logout(@Req() req: Request, @Res() res: Response) {
		req.logout(() => {});
		req.session.destroy(() => {});
		return res.redirect('http://localhost:5173');
	}
}
