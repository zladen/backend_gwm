import { Module } from '@nestjs/common';
import { LocationService } from './location.service';
import { LocationResolver } from './location.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { LocationSchema } from './entities/location.entity';

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: 'Location', schema: LocationSchema },
		]),
	],
	providers: [LocationResolver, LocationService],
})
export class LocationModule {}
