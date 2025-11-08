import { Field, InputType } from '@nestjs/graphql';
import { Role } from 'src/auth/interfaces/role.interface';

@InputType()
export class CreateUserInput {
	@Field(() => String)
	firstName: string;

	@Field(() => String)
	lastName: string;

	@Field(() => String)
	image: string;

	@Field(() => String)
	email: string;

	@Field(() => [String])
	roles: Role[];

	@Field(() => Date)
	createdAt: Date;

	@Field(() => Date)
	updatedAt: Date;
}
