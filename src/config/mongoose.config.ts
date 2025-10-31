import { ConfigService } from '@nestjs/config';
import { MongooseModuleOptions } from '@nestjs/mongoose';

export async function getMongooseConfig(
	configService: ConfigService,
): Promise<MongooseModuleOptions> {
	const options: MongooseModuleOptions = {
		uri: configService.getOrThrow<string>('MONGODB_URI'),
	};

	return options;
}
