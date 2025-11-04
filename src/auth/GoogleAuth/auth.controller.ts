import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import type { Request, Response } from 'express';
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

	@Get('profile')
	@UseGuards(SessionAuthGuard)
	getProfile(@Req() req: Request) {
		return req.user;
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
