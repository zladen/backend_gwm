import { Field, Float, InputType } from '@nestjs/graphql';
import { CreateLocationInput } from './create-location.input';
import { PartialType } from '@nestjs/mapped-types';
import { Schema as MongooSchema } from 'mongoose';

@InputType()
export class UpdateLocationInput extends PartialType(CreateLocationInput) {
	@Field(() => String)
	_id: MongooSchema.Types.ObjectId;

	@Field(() => String)
	type: string;

	@Field(() => [Float])
	coordinates: [number, number];
}
