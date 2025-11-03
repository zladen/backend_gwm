import { Module } from '@nestjs/common';

import { ConfigModule, ConfigService } from '@nestjs/config';

import { GraphQLModule } from '@nestjs/graphql';
import { getGraphQLConfig } from './config/graphql.config';
import { ApolloDriver } from '@nestjs/apollo';
import { MongooseModule } from '@nestjs/mongoose';
import { getMongooseConfig } from './config/mongoose.config';
import { UserModule } from './user/user.module';
import { LocationModule } from './location/location.module';
import { AuthModule } from './auth/GoogleAuth/auth.module';
@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
		}),

		GraphQLModule.forRootAsync({
			driver: ApolloDriver,
			imports: [ConfigModule],
			useFactory: getGraphQLConfig,
			inject: [ConfigService],
		}),

		MongooseModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: getMongooseConfig,
			inject: [ConfigService],
		}),

		ConfigModule.forRoot({
			cache: true,
		}),

		UserModule,

		LocationModule,

		AuthModule,
	],

	controllers: [],
	providers: [],
})

// Подключаем LoggingMiddleware глобально ко всем маршрутам
export class AppModule {}
