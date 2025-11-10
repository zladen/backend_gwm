import {
	Injectable,
	NotFoundException,
	ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { SessionDocument } from './entities/session.entity';

@Injectable()
export class SessionService {
	constructor(
		@InjectModel('Session')
		private readonly sessionModel: Model<SessionDocument>,
	) {}

	// получение всех сессий пользователя по его id
	async listSessionsForUser(userId: string | Types.ObjectId) {
		if (!userId) return [];
		const idStr =
			userId instanceof Types.ObjectId
				? userId.toString()
				: String(userId);

		return this.sessionModel
			.find({
				$or: [{ user: idStr }, { 'session.passport.user': idStr }],
			})
			.lean()
			.exec();
	}

	// удаление сессии по sid, только если она принадлежит текущему пользователю
	async deleteSessionById(
		sid: string,
		currentUserId: string | Types.ObjectId,
	) {
		const session = await this.sessionModel.findOne({ _id: sid }).exec();
		if (!session) throw new NotFoundException('Session not found');

		const idStr =
			currentUserId instanceof Types.ObjectId
				? currentUserId.toString()
				: String(currentUserId);

		const sessionUserId = (() => {
			if (session.user) return String(session.user);
			try {
				// сесионная информация может содержать passport.user в виде строки/числа
				return String((session as any).session?.passport?.user ?? null);
			} catch {
				return null;
			}
		})();

		if (!sessionUserId || sessionUserId !== idStr) {
			throw new ForbiddenException(
				'Cannot delete session that does not belong to you',
			);
		}

		await this.sessionModel.deleteOne({ _id: sid }).exec();
		return true;
	}
}
