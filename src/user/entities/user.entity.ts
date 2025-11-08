import { ObjectType, Field } from '@nestjs/graphql';
import { Document, Schema as MongooSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Role } from 'src/auth/interfaces/role.interface';
@ObjectType()
@Schema({ timestamps: true })
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
	image: string;

	@Field(() => String, { nullable: true })
	@Prop({ type: String })
	description: string;

	@Field(() => [String])
	@Prop({ type: [String], enum: Object.values(Role), default: [Role.USER] })
	roles: Role[];

	@Field(() => Date)
	@Prop({ type: Date, default: Date.now })
	createdAt: Date;

	@Field(() => Date)
	@Prop({ type: Date, default: Date.now })
	updatedAt: Date;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
