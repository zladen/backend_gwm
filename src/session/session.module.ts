import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SessionSchema } from './entities/session.entity';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: 'Session', schema: SessionSchema }]),
	],
	exports: [MongooseModule],
})
export class SessionModule {}
