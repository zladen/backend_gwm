import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { GoogleOAuthGuard } from '../GoogleAuth/guard/google-oauth.guard';
import { SessionAuthGuard } from '../GoogleAuth/guard/session-auth.guard';

@Controller('auth')
export class AuthController {
	@Get('google')
	@UseGuards(GoogleOAuthGuard)
	googleAuth() {
		// редирект на Google
	}

	@Get('google/callback')
	@UseGuards(GoogleOAuthGuard)
	googleAuthRedirect(@Req() req: Request) {
		// req.user уже есть
		return {
			message: 'Успешная авторизация через Google!',
			user: req.user,
		};
	}

	@Get('profile')
	@UseGuards(SessionAuthGuard)
	getProfile(@Req() req: Request) {
		return req.user;
	}

	@Get('logout')
	logout(@Req() req: Request) {
		req.logout(() => {});
		return { message: 'Вы успешно вышли' };
	}
}
