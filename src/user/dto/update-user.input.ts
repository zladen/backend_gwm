import { Field, InputType } from '@nestjs/graphql';
import { Schema as MongooSchema } from 'mongoose';
import { Role } from 'src/auth/interfaces/role.interface';

@InputType()
export class UpdateUserInput {
	@Field(() => String)
	_id: MongooSchema.Types.ObjectId;

	@Field(() => String, { nullable: true })
	firstName: string;

	@Field(() => String, { nullable: true })
	lastName: string;

	@Field(() => String, { nullable: true })
	email: string;

	@Field(() => String, { nullable: true })
	image: string;

	@Field(() => String, { nullable: true })
	description: string;

	@Field(() => [String!], { nullable: true })
	roles: Role[];

	@Field(() => Date, { nullable: true })
	updatedAt: Date;
}
