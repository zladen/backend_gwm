import { ObjectType, Field } from '@nestjs/graphql';
import { Document, Schema as MongooSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@ObjectType()
@Schema()
export class User {
	@Field(() => String)
	_id: MongooSchema.Types.ObjectId;

	// Add user properties
	@Field(() => String)
	@Prop()
	name: string;

	@Field(() => String)
	@Prop({ unique: true })
	email: string;

	@Field(() => String)
	@Prop()
	password: string;

	@Field(() => String)
	@Prop()
	address: string;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
