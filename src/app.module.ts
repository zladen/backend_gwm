import { Module } from '@nestjs/common';

import { ConfigModule, ConfigService } from '@nestjs/config';

import { GraphQLModule } from '@nestjs/graphql';
import { getGraphQLConfig } from './config/graphql.config';
import { ApolloDriver } from '@nestjs/apollo';
import { AppService } from './app.service';
import { AppResolver } from './app.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { getMongooseConfig } from './config/mongoose.config';
import { UserModule } from './user/user.module';

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

		// AuthModule,
		// UserModule,
		// PersonModule,
	],

	controllers: [],
	providers: [AppService, AppResolver],
})

// Подключаем LoggingMiddleware глобально ко всем маршрутам
export class AppModule {}
