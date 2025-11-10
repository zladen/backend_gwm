import { Role } from '../interfaces/role.interface';

// информация о пользователе, которая сохраняется в сессии / передаётся в passport
export type AuthUserPayload = {
	_id: string | undefined;
	email?: string;
	firstName?: string;
	lastName?: string;
	roles?: Role[];
};
