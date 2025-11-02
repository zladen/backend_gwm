import { Field, Float, InputType } from '@nestjs/graphql';

@InputType()
export class CreateLocationInput {
	@Field(() => String)
	type: string;

	@Field(() => [Float])
	coordinates: [number, number];
}
