import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ collection: 'sessions' })
export class Session {
	// идентификатор сессии из express-session (sid)
	@Prop({ required: true })
	_id: string;

	// ссылка на id пользователя (если присутствует)
	@Prop({ type: Types.ObjectId, ref: 'User', index: true, sparse: true })
	user?: Types.ObjectId;

	// необработанные данные сессии, хранимые стором (необязательно)
	@Prop({ type: Object })
	session?: Record<string, any>;

	// метаданные, полезные для админки/аналитики
	@Prop()
	ip?: string;

	@Prop()
	userAgent?: string;

	@Prop({ type: Date })
	lastActiveAt?: Date;

	// дата истечения (connect-mongo использует поле expires)
	@Prop({ type: Date })
	expires?: Date;
}

export type SessionDocument = Session & Document;
export const SessionSchema = SchemaFactory.createForClass(Session);
