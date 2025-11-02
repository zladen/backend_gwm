import { ObjectType, Field } from '@nestjs/graphql';
import { Document, Schema as MongooSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Location } from 'src/location/entities/location.entity';

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
	image: string;

	@Field(() => String)
	@Prop()
	description: string;

	@Field(() => Location)
	@Prop()
	location: Location;

	// @Field(() => String)
	// @Prop()
	// categories: Categories;

	// @Field(() => String)
	// @Prop()
	// tags: Tags;

	emailVerified: Boolean;

	// @Field(() => String)
	// @Prop()
	// password: string;

	// @Field(() => String)
	// @Prop()
	// address: string;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
