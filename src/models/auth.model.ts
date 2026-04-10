/**
 *
 * @author dongntd267@gmail.com on 26/07/2023.
 *
 */

/** libs */
import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';

/** constants */
import { AppKey } from '@constants/AppKey';

/** utils */
import { genToken } from '@utils/auth';

/** types */
import type { Model } from 'mongoose';

export interface TypeAuth {
    uid: string;
    password: string;
    refreshToken: string;
}

interface TypeAuthModel extends Model<TypeAuth> {
    getAuth(payload: { uid: string }): Promise<TypeAuth | null>;
    setAuth(payload: { uid: string; password: string }): Promise<TypeAuth>;
    updateAuth(payload: { uid: string; data: Partial<Omit<TypeAuth, 'uid'>> }): Promise<TypeAuth>;
    deleteAuth(payload: { uid: string }): Promise<boolean>;
    getRefreshToken(payload: { uid: string }): Promise<TypeAuth['refreshToken'] | undefined>;
}

export const AuthSchema = new Schema<TypeAuth, TypeAuthModel>(
    {
        uid: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
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

AuthSchema.statics = {
    getAuth: async function (payload: { uid: string }): Promise<TypeAuth | null> {
        const { uid } = payload;
        const Auth = await this.findOne({ $or: [{ uid }] }).exec();
        return Auth ? Auth.toObject({ versionKey: false }) : Auth;
    },
    setAuth: async function (payload: { uid: string; password: string }): Promise<TypeAuth> {
        const { uid, password } = payload;
        const hash = bcrypt.hashSync(password, 10);
        const Auth = await this.create({
            uid,
            password: hash,
            refreshToken: genToken(uid, AppKey.refreshToken)
        });
        return Auth.toObject({ versionKey: false });
    },
    updateAuth: async function (payload: { uid: string; data: Omit<TypeAuth, 'uid'> }): Promise<TypeAuth | null> {
        const { uid, data } = payload;
        const Auth = await this.findOneAndUpdate({ uid }, data, { returnDocument: 'after' }).exec();
        return Auth ? Auth.toObject({ versionKey: false }) : Auth;
    },
    deleteAuth: async function (payload: { uid: string }): Promise<boolean> {
        const { uid } = payload;
        await this.deleteOne({ uid }).exec();
        return true;
    },
    getRefreshToken: async function (payload: { uid: string }): Promise<TypeAuth['refreshToken'] | undefined> {
        const { uid } = payload;
        const Auth = await this.findOne({ uid }).exec();
        return Auth ? Auth.toObject({ versionKey: false }).refreshToken : undefined;
    }
};

export const AuthModel = model<TypeAuth, TypeAuthModel>('Auths', AuthSchema);
