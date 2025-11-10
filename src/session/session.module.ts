import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SessionSchema } from './entities/session.entity';
import { SessionService } from './session.service';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: 'Session', schema: SessionSchema }]),
	],
	providers: [SessionService],
	exports: [SessionService, MongooseModule],
})
export class SessionModule {}
