import { ObjectType, Field, Float } from '@nestjs/graphql';
import { Document, Schema as MongooSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@ObjectType()
@Schema()
@ObjectType()
@Schema()
export class Location {
	@Field(() => String)
	_id: MongooSchema.Types.ObjectId;

	@Field(() => String)
	@Prop({ type: String, enum: ['Point'], required: true })
	type: string;

	@Field(() => [Float])
	@Prop({ type: [Number], required: true })
	coordinates: [number, number];
}

export type LocationDocument = Location & Document;
export const LocationSchema = SchemaFactory.createForClass(Location);
