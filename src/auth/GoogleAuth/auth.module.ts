import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { GoogleAuthStrategy } from './strategies/google.strategy';
import { ConfigModule } from '@nestjs/config';
import { SessionSerializer } from '../serializer/session.serializer';
import { AuthResolver } from './auth.resolver';
import { GoogleOAuthGuard } from './guard/google-oauth.guard';
import { SessionAuthGuard } from '../guard/session-auth.guard';
import { RolesGuard } from '../guard/roles.guard';
import { SessionModule } from 'src/session/session.module';

@Module({
	imports: [
		ConfigModule, // чтобы использовать ConfigService в стратеги
		PassportModule.register({ session: true }), // регистрация passport
		UserModule,
		SessionModule,
	],
	providers: [
		AuthService,
		GoogleAuthStrategy,
		SessionSerializer,
		AuthResolver,
		GoogleOAuthGuard,
		SessionAuthGuard,
		RolesGuard,
	], // регистрируем провайдеры: сервис, стратегия, сериалайзер, резолвер и guards
	controllers: [AuthController], // регистрируем контроллер
})
export class AuthModule {}
