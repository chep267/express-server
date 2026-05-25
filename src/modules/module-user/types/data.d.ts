/**
 *
 * @author dongntd267@gmail.com on 26/07/2023.
 *
 */

export type UserStatus = 'online' | 'offline' | 'away' | 'busy';

export type UserRole = 'admin' | 'moderator' | 'user';

export interface TypeUser {
    _id: string;
    uid: string;
    email?: string;
    name?: string;
    phone?: string;
    photo?: string;
    role: UserRole;
    status: UserStatus;
    statusMessage?: string;
    blockedUsers?: string[];
    fcmTokens?: string[];
    lastActiveAt?: string;
    createdAt?: string;
    updatedAt?: string;
}
