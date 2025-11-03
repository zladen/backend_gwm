import {
	Strategy as GoogleStrategy,
	VerifyCallback,
} from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from './../auth.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleAuthStrategy extends PassportStrategy(
	GoogleStrategy,
	'google',
) {
	constructor(
		private readonly authService: AuthService,
		configService: ConfigService,
	) {
		super({
			clientID: configService.getOrThrow<string>('GOOGLE_CLIENT_ID'),
			clientSecret: configService.getOrThrow<string>(
				'GOOGLE_CLIENT_SECRET',
			),
			callbackURL: configService.getOrThrow<string>(
				'GOOGLE_CALLBACK_URL',
			),
			scope: ['profile', 'email'],
		});
	}

	async validate(
		accessToken: string,
		refreshToken: string,
		profile: any,
		done: VerifyCallback,
	): Promise<any> {
		const { name, emails, photos } = profile;
		const userData = {
			email: emails[0].value,
			firstName: name.givenName,
			lastName: name.familyName,
			picture: photos[0].value,
			accessToken,
			refreshToken,
		};

		try {
			// сохраняем или обновляем пользователя через AuthService
			const user = await this.authService.validateUser(userData);
			console.log('Google strategy - validated user in strategy:', user && (user as any).email);
			// передаём найденного/созданного пользователя дальше в passport
			done(null, user);
		} catch (err) {
			done(err, false);
		}
	}
}
