import type { Request, Response } from 'express';
import type { Session } from 'express-session';
import { User } from 'src/user/entities/user.entity';

// Типизированный запрос с поддержкой passport
export type ReqWithPassport = Request & {
	user?: Partial<User> | null;
	logIn(user: Partial<User>, done: (err?: unknown) => void): void;
	logout(callback: (err?: unknown) => void): void;
	session: Session & { passport?: { user?: string } };
};

// GraphQL context
export type GqlContext = {
	req: ReqWithPassport;
	res: Response;
};
