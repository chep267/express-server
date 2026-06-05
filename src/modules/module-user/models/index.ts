/**
 *
 * @author dongntd267@gmail.com on 26/07/2023.
 *
 */

/** libs */
import { model, Schema } from 'mongoose';

/** constants */
import { UserDatabaseKey } from '@module-user/constants/key';

/** types */
import type { QueryFilter } from 'mongoose';

export const UserSchema = new Schema<App.ModuleUser.Data.TypeUser, App.ModuleUser.Model.UserModel>(
    {
        uid: {
            type: String,
            required: true,
            unique: true
        },
        email: {
            type: String,
            lowercase: true,
            required: [true, "can't be blank"],
            match: [/\S+@\S+\.\S+/, 'is invalid'],
            unique: true
        },
        name: {
            type: String,
            default: ''
        },
        phone: {
            type: String,
            default: ''
        },
        photo: {
            type: String,
            default: ''
        },
        role: {
            type: String,
            enum: ['admin', 'moderator', 'user'],
            default: 'user'
        },
        status: {
            type: String,
            enum: ['online', 'offline', 'away', 'busy'],
            default: 'offline'
        },
        statusMessage: {
            type: String,
            default: ''
        },
        blockedUsers: {
            type: [String],
            default: []
        },
        fcmTokens: {
            type: [String],
            default: []
        },
        lastActiveAt: {
            type: String,
            default: () => new Date().toISOString()
        }
    },
    {
        timestamps: true
    }
);

UserSchema.statics = {
    check: async function (
        payload: App.ModuleUser.Model.Users['Check']['Payload']
    ): App.ModuleUser.Model.Users['Check']['Return'] {
        const { uid, email } = payload;
        const conditions: Array<Partial<App.ModuleUser.Data.TypeUser>> = [];

        if (uid) conditions.push({ uid });
        if (email) conditions.push({ email });

        if (conditions.length === 0) return false;

        const result = await this.exists({ $or: conditions }).exec();
        return !!result;
    },
    get: async function (payload: App.ModuleUser.Model.Users['Get']['Payload']): App.ModuleUser.Model.Users['Get']['Return'] {
        const { uid, email } = payload;
        const conditions: Array<Partial<App.ModuleUser.Data.TypeUser>> = [];

        if (uid) conditions.push({ uid });
        if (email) conditions.push({ email });

        if (conditions.length === 0) return null;

        const user = await this.findOne({ $or: conditions }).exec();
        return user?.toObject({ versionKey: false }) ?? null;
    },
    gets: async function (
        payload: App.ModuleUser.Model.Users['Gets']['Payload']
    ): App.ModuleUser.Model.Users['Gets']['Return'] {
        const { q = '', page = '1', limit = '20' } = payload;
        const searchKey = q.trim();
        const pageNumber = Math.max(1, Number(page));
        const limitNumber = Math.max(1, Number(limit));
        const skip = (pageNumber - 1) * limitNumber;

        const queryCondition: QueryFilter<App.ModuleUser.Data.TypeUser> = {};
        if (searchKey) {
            queryCondition.name = { $regex: searchKey, $options: 'i' };
        }

        const [items, totalItems] = await Promise.all([
            this.find(queryCondition).skip(skip).limit(limitNumber).sort({ name: -1 }).exec(),
            this.countDocuments(queryCondition).exec()
        ]);
        const totalPages = Math.ceil(totalItems / limitNumber);

        return {
            items: items.map((item) => item.toObject({ versionKey: false })),
            currentPage: pageNumber,
            currentItems: items.length,
            totalPages,
            totalItems
        };
    },
    create: async function (
        payload: App.ModuleUser.Model.Users['Create']['Payload']
    ): App.ModuleUser.Model.Users['Create']['Return'] {
        const { uid, email } = payload;
        const user = new this({
            uid,
            email,
            name: email?.split('@')[0].split('.')[0]
        });
        return user.toObject({ versionKey: false });
    },
    update: async function (
        payload: App.ModuleUser.Model.Users['Update']['Payload']
    ): App.ModuleUser.Model.Users['Update']['Return'] {
        const { data } = payload;
        const user = await this.findOneAndUpdate({ uid: data.uid }, data, { returnDocument: 'after' }).exec();
        return user?.toObject({ versionKey: false }) ?? null;
    },
    delete: async function (
        payload: App.ModuleUser.Model.Users['Delete']['Payload']
    ): App.ModuleUser.Model.Users['Delete']['Return'] {
        const { uid } = payload;
        await this.deleteOne({ uid }).exec();
        return true;
    }
};

export const UserModel = model<App.ModuleUser.Data.TypeUser, App.ModuleUser.Model.UserModel>(
    UserDatabaseKey.users,
    UserSchema
);
