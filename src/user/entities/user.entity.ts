import { ObjectType, Field } from '@nestjs/graphql';
import { Document, Schema as MongooSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Location } from 'src/location/entities/location.entity';

@ObjectType()
@Schema()
export class User {
	@Field(() => String)
	_id: MongooSchema.Types.ObjectId;

	@Field(() => String)
	@Prop({ type: String })
	firstName: string;

	@Field(() => String)
	@Prop({ type: String })
	lastName: string;

	@Field(() => String)
	@Prop({ type: String, unique: true })
	email: string;

	@Field(() => String, { nullable: true })
	@Prop({ type: String })
	image?: string;

	@Field(() => String, { nullable: true })
	@Prop({ type: String })
	description?: string;

	@Field(() => Location, { nullable: true })
	@Prop({ type: MongooSchema.Types.ObjectId, ref: 'Location' })
	location?: Location;

	@Field(() => Boolean)
	emailVerified: boolean;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
