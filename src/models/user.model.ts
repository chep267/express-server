/**
 *
 * @author dongntd267@gmail.com on 26/07/2023.
 *
 */

/** libs */
import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';

/** types */
import type { Model } from 'mongoose';

export interface TypeUser {
    _id: string;
    uid: string;
    name: string;
    photo: string;
    email: string;
    password: string;
    role: string;
    refreshToken: string;
}

interface TypeUserModel extends Model<TypeUser> {
    getUser(payload: { email?: string; uid?: string }): Promise<TypeUser | null>;
    setUser(payload: { email: string; password: string }): Promise<TypeUser>;
    updateUser(
        payload: { uid: string; data: Partial<Omit<TypeUser, 'uid'>> },
        options?: { returnOriginal?: boolean }
    ): Promise<TypeUser>;
    deleteUser(payload: { uid: string }): Promise<boolean>;
    getRefreshToken(payload: { uid: string }): Promise<TypeUser['refreshToken'] | undefined>;
}

export const UserSchema = new Schema<TypeUser, TypeUserModel>(
    {
        uid: {
            type: String,
            required: true,
            unique: true
        },
        name: {
            type: String,
            required: true,
            unique: true
        },
        photo: {
            type: String
        },
        email: {
            type: String,
            lowercase: true,
            required: [true, "can't be blank"],
            match: [/\S+@\S+\.\S+/, 'is invalid'],
            index: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        role: {
            type: String,
            required: true,
            default: 'user'
        },
        refreshToken: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

UserSchema.statics = {
    getUser: async function (payload: { email?: string; uid?: string }): Promise<TypeUser | null> {
        const { email, uid } = payload;
        const user = await this.findOne({ $or: [{ email }, { uid }] }).exec();
        return user ? user.toObject({ versionKey: false }) : user;
    },
    setUser: async function (payload: { email: string; password: string }): Promise<TypeUser> {
        const { email, password } = payload;
        const hash = bcrypt.hashSync(password, 10);
        const user = await this.create({
            uid: `uid_${Date.now()}`,
            email,
            password: hash,
            name: email.split('@')[0].split('.')[0],
            photo: '',
            role: 'user',
            refreshToken: 'chep_client'
        });
        return user.toObject({ versionKey: false });
    },
    updateUser: async function (
        payload: { uid: string; data: Omit<TypeUser, 'uid'> },
        options?: { returnOriginal?: boolean }
    ): Promise<TypeUser | null> {
        const { uid, data } = payload;
        const { returnOriginal = false } = options ?? {};
        const user = await this.findOneAndUpdate({ uid }, data, { returnOriginal }).exec();
        return user ? user.toObject({ versionKey: false }) : user;
    },
    deleteUser: async function (payload: { uid: string }): Promise<boolean> {
        const { uid } = payload;
        await this.deleteOne({ uid }).exec();
        return true;
    },
    getRefreshToken: async function (payload: { uid: string }): Promise<TypeUser['refreshToken'] | undefined> {
        const { uid } = payload;
        const user = await this.findOne({ uid }).exec();
        return user ? user.toObject({ versionKey: false }).refreshToken : undefined;
    }
};

export const UserModel = model<TypeUser, TypeUserModel>('Users', UserSchema);
