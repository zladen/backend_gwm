import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/user/entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { GoogleAuthStrategy } from './strategies/google.strategy';
import { ConfigModule } from '@nestjs/config';
import { SessionSerializer } from './serializer/google-session.serializer';

@Module({
	imports: [
		ConfigModule, // чтобы использовать ConfigService в стратегии
		PassportModule.register({ session: true }), // регистрация passport
		MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), // подключаем модель User
	],
	providers: [AuthService, GoogleAuthStrategy, SessionSerializer], // регистрируем сервис и стратегию
	controllers: [AuthController], // регистрируем контроллер
})
export class AuthModule {}
