/**
 *
 * @author dongntd267@gmail.com on 26/07/2023.
 *
 */

/** libs */
import { Schema, model } from 'mongoose';

/** types */
import type { Model } from 'mongoose';

export interface TypeUser {
    _id: string;
    uid: string;
    name: string;
    photo: string;
    email: string;
    role: string;
}

interface TypeUserModel extends Model<TypeUser> {
    getUser(payload: { uid?: string; email?: string }): Promise<TypeUser | null>;
    setUser(payload: { uid: string; email: string }): Promise<TypeUser>;
    updateUser(payload: { uid: string; data: Partial<Omit<TypeUser, 'uid'>> }): Promise<TypeUser>;
    deleteUser(payload: { uid: string }): Promise<boolean>;
    hasUser(payload: { uid?: string; email?: string }): Promise<boolean>;
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
        role: {
            type: String,
            required: true,
            default: 'user'
        }
    },
    {
        timestamps: true
    }
);

UserSchema.statics = {
    getUser: async function (payload: { uid?: string; email?: string }): Promise<TypeUser | null> {
        const { uid, email } = payload;
        const user = await this.findOne({ $or: [{ email }, { uid }] }).exec();
        return user ? user.toObject({ versionKey: false }) : user;
    },
    setUser: async function (payload: { uid: string; email: string }): Promise<TypeUser> {
        const { uid, email } = payload;
        const user = await this.create({
            uid,
            email,
            name: email.split('@')[0].split('.')[0],
            photo: '',
            role: 'user'
        });
        return user.toObject({ versionKey: false });
    },
    updateUser: async function (payload: { uid: string; data: Omit<TypeUser, 'uid'> }): Promise<TypeUser | null> {
        const { uid, data } = payload;
        const user = await this.findOneAndUpdate({ uid }, data, { returnDocument: 'after' }).exec();
        return user ? user.toObject({ versionKey: false }) : user;
    },
    deleteUser: async function (payload: { uid: string }): Promise<boolean> {
        const { uid } = payload;
        await this.deleteOne({ uid }).exec();
        return true;
    },
    hasUser: async function (payload: { uid?: string; email?: string }): Promise<boolean> {
        const { uid, email } = payload;
        const user = await this.findOne({ $or: [{ email }, { uid }] }).exec();
        return !!user;
    }
};

export const UserModel = model<TypeUser, TypeUserModel>('Users', UserSchema);
