import 'express';
import 'express-session';

// Описываем структуру данных пользователя
interface UserPayload {
	id: string;
	email: string;
	firstName?: string;
	lastName?: string;
	provider?: string;
}

// Расширяем тип Request из Express
declare module 'express-serve-static-core' {
	interface Request {
		user?: UserPayload; // Passport добавляет сюда пользователя
		session: import('express-session').Session &
			Partial<import('express-session').SessionData>;
	}
}

// Расширяем интерфейс сессии
declare module 'express-session' {
	interface SessionData {
		user?: UserPayload;
	}
}
