import { Module } from '@nestjs/common';

import { ConfigModule, ConfigService } from '@nestjs/config';

import { GraphQLModule } from '@nestjs/graphql';
import { getGraphQLConfig } from './config/graphql.config';
import { ApolloDriver } from '@nestjs/apollo';
import { AppService } from './app.service';
import { AppResolver } from './app.resolver';

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

		// AuthModule,
		// UserModule,
		// PersonModule,
	],

	controllers: [],
	providers: [AppService, AppResolver],
})

// Подключаем LoggingMiddleware глобально ко всем маршрутам
export class AppModule {}
