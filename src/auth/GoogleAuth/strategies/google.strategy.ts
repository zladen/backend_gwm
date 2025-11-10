import {
	Strategy as GoogleStrategy,
	VerifyCallback,
} from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from './../auth.service';
import { ConfigService } from '@nestjs/config';
import { GoogleProfile } from '../interfaces/profile.interface';
import { Role } from 'src/auth/interfaces/role.interface';
import { AuthUserPayload } from 'src/auth/dto/auth-user.payload';

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
		profile: GoogleProfile,
		done: VerifyCallback,
	): Promise<void> {
		const { name, emails, photos } = profile;
		const userData = {
			firstName: name.givenName,
			lastName: name.familyName,
			image: photos[0].value,
			email: emails[0].value,
			accessToken,
			refreshToken,
		};

		try {
			// сохраняем или обновляем пользователя через AuthService
			const user = await this.authService.validateUser(userData);
			const userSaved: AuthUserPayload = {
				_id: user?._id?.toString(),
				email: user?.email,
				firstName: user?.firstName,
				lastName: user?.lastName,
				roles: user?.roles,
			};

			// передаём найденного/созданного пользователя дальше в passport
			done(null, userSaved);
		} catch (err) {
			done(err, false);
		}
	}
}
