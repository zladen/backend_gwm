import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/user/entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { GoogleAuthStrategy } from './strategies/google.strategy';
import { ConfigModule } from '@nestjs/config';
import { SessionSerializer } from './serializer/google-session.serializer';
import { AuthResolver } from './auth.resolver';
import { GoogleOAuthGuard } from './guard/google-oauth.guard';
import { SessionAuthGuard } from './guard/session-auth.guard';

@Module({
	imports: [
		ConfigModule, // чтобы использовать ConfigService в стратеги
		PassportModule.register({ session: true }), // регистрация passport
		MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), // подключаем модель User
	],
	providers: [
		AuthService,
		GoogleAuthStrategy,
		SessionSerializer,
		AuthResolver,
		GoogleOAuthGuard,
		SessionAuthGuard,
	], // регистрируем провайдеры: сервис, стратегия, сериалайзер, резолвер и guards
	controllers: [AuthController], // регистрируем контроллер
})
export class AuthModule {}
