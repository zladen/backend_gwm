import {
	Controller,
	ForbiddenException,
	Get,
	Param,
	Req,
	Res,
	UseGuards,
	Delete,
} from '@nestjs/common';
import type { Response } from 'express';
import type { ReqWithPassport } from 'src/auth/types/graphql-context';
import { GoogleOAuthGuard } from '../GoogleAuth/guard/google-oauth.guard';
import { SessionAuthGuard } from '../guard/session-auth.guard';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '../interfaces/role.interface';
import { RolesGuard } from '../guard/roles.guard';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { SessionService } from 'src/session/session.service';
import { Schema as MongooSchema } from 'mongoose';

@Controller('auth')
export class AuthController {
	constructor(
		private readonly userService: UserService,
		private readonly sessionService: SessionService,
	) {}

	@Get('google')
	@UseGuards(GoogleOAuthGuard)
	googleAuth() {
		// редирект на Google
	}

	@Get('google/callback')
	@UseGuards(GoogleOAuthGuard)
	async googleAuthRedirect(
		@Req() req: ReqWithPassport,
		@Res() res: Response,
	) {
		// req.user уже есть после авторизации через Google
		console.log('google callback req.user =', req.user);
		const user = req.user;

		return new Promise((resolve) => {
			req.logIn(user ?? {}, (err?: Error | null) => {
				if (err) {
					// Ошибка при логине — направляем пользователя на страницу ошибки
					console.error('req.logIn error', err);
					res.redirect('http://localhost:3001/error');
					return resolve(null);
				}

				// сохраняем сессию перед редиректом (если стор предоставляет save)
				if (req.session && typeof req.session.save === 'function') {
					req.session.save((saveErr?: Error | null) => {
						if (saveErr)
							console.error('session save error', saveErr);
						console.log(
							'session saved, session.passport =',
							req.session?.passport,
						);
						res.redirect('http://localhost:3001/');
						return resolve(null);
					});
				} else {
					// если save не доступен — просто редиректим
					console.log('session.save not available, skipping save');
					res.redirect('http://localhost:3001/');
					return resolve(null);
				}
			});
		});
	}

	// Публичный профиль - доступен всем авторизованным пользователям
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
		@Req() req: ReqWithPassport,
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

	// Диагностический эндпоинт: возвращает req.user и информацию о сессии (без guard)
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

	// Диагностический эндпоинт: защищён SessionAuthGuard
	// @Get('session-protected')
	// @UseGuards(SessionAuthGuard)
	// sessionProtected(@Req() req: Request) {
	// 	console.log('session-protected - req.user =', (req as any).user);
	// 	return { ok: true, user: (req as any).user };
	// }

	@Get('logout')
	logout(@Req() req: ReqWithPassport, @Res() res: Response) {
		// Важно: дождаться завершения req.logout, затем удалять сессию.
		// Иначе возможна гонка: если session.destroy вызван раньше, passport может
		// попытаться вызвать req.session.regenerate и получить undefined.
		req.logout((err?: Error | null) => {
			if (err) {
				console.error('req.logout error', err);
			}
			if (req.session && typeof req.session.destroy === 'function') {
				req.session.destroy((destroyErr?: Error | null) => {
					if (destroyErr)
						console.error('session.destroy error', destroyErr);
					return res.redirect('http://localhost:3001');
				});
			} else {
				return res.redirect('http://localhost:3001');
			}
		});
	}

	// Список сессий для текущего пользователя
	@Get('sessions')
	@UseGuards(SessionAuthGuard)
	async listSessions(@Req() req: ReqWithPassport) {
		const currentUser = req.user as User | undefined | null;
		// предпочитаем _id (ObjectId), передаём в сервис как строку (сервис принимает ObjectId|string)
		const userId = currentUser?._id ?? null;
		if (!userId) return [];
		return this.sessionService.listSessionsForUser(String(userId));
	}

	// Удалить конкретную сессию (по sid) для текущего пользователя
	@Delete('sessions/:sid')
	@UseGuards(SessionAuthGuard)
	async deleteSession(
		@Param('sid') sid: string,
		@Req() req: ReqWithPassport,
	) {
		const currentUser = req.user as User | undefined | null;
		const userId = currentUser?._id ?? null;
		if (!userId) throw new ForbiddenException('Not authenticated');
		const ok = await this.sessionService.deleteSessionById(
			sid,
			String(userId),
		);
		return { ok };
	}
}
