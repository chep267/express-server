/**
 *
 * @author dongntd267@gmail.com on 26/07/2023.
 *
 */

/** libs */
import { model, Schema } from 'mongoose';

/** constants */
import { AppRegex } from '@module-base/constants/AppRegex';
import { UserDatabaseKey } from '@module-user/constants/key';

/** types */
import type { QueryFilter } from 'mongoose';

export const UserSchema = new Schema<App.ModuleUser.Data.TypeUser, App.ModuleUser.Model.UserModel>(
    {
        id: {
            type: String,
            required: true,
            unique: true
        },
        email: {
            type: String,
            lowercase: true,
            required: true,
            match: [AppRegex.email, 'is invalid'],
            unique: true
        },
        name: {
            type: String,
            default: ''
        },
        phone: {
            type: String,
            match: [AppRegex.phone, 'is invalid'],
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
            default: ''
        }
    },
    {
        timestamps: true,
        toObject: {
            versionKey: false
        }
    }
);

UserSchema.statics = {
    check: async function (
        payload: App.ModuleUser.Model.UserModelAction['Check']['Payload']
    ): App.ModuleUser.Model.UserModelAction['Check']['Return'] {
        const { uid, email } = payload;
        const conditions: Array<Partial<App.ModuleUser.Data.TypeUser>> = [];

        if (uid) conditions.push({ id: uid });
        if (email) conditions.push({ email });

        if (conditions.length === 0) return false;

        const result = await this.exists({ $or: conditions }).exec();
        return !!result;
    },
    get: async function (
        payload: App.ModuleUser.Model.UserModelAction['Get']['Payload']
    ): App.ModuleUser.Model.UserModelAction['Get']['Return'] {
        const { uid, email } = payload;
        const conditions: Array<Partial<App.ModuleUser.Data.TypeUser>> = [];

        if (uid) conditions.push({ id: uid });
        if (email) conditions.push({ email });

        if (conditions.length === 0) return null;

        return await this.findOne({ $or: conditions }).select('-_id -__v').lean().exec();
    },
    gets: async function (
        payload: App.ModuleUser.Model.UserModelAction['Gets']['Payload']
    ): App.ModuleUser.Model.UserModelAction['Gets']['Return'] {
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
            this.find(queryCondition)
                .skip(skip)
                .limit(limitNumber)
                .sort({ name: -1 })
                .select('-_id -__v')
                .lean()
                .exec(),
            this.countDocuments(queryCondition).exec()
        ]);
        const totalPages = Math.ceil(totalItems / limitNumber);

        return {
            data: items,
            metadata: {
                currentPage: pageNumber,
                currentItems: items.length,
                totalPages,
                totalItems
            }
        };
    },
    create: async function (
        payload: App.ModuleUser.Model.UserModelAction['Create']['Payload']
    ): App.ModuleUser.Model.UserModelAction['Create']['Return'] {
        const { uid, email } = payload;

        const user = await new this({
            id: uid,
            email,
            name: email?.split('@')[0].split('.')[0]
        }).save();

        return user.toObject();
    },
    update: async function (
        payload: App.ModuleUser.Model.UserModelAction['Update']['Payload']
    ): App.ModuleUser.Model.UserModelAction['Update']['Return'] {
        const { uid, data } = payload;

        return await this.findOneAndUpdate({ id: uid }, data, {
            returnDocument: 'after',
            lean: true,
            projection: { _id: 0, __v: 0 }
        }).exec();
    },
    delete: async function (
        payload: App.ModuleUser.Model.UserModelAction['Delete']['Payload']
    ): App.ModuleUser.Model.UserModelAction['Delete']['Return'] {
        const { uid } = payload;
        await this.deleteOne({ id: uid }).exec();
        return true;
    }
};

export const UserModel = model<App.ModuleUser.Data.TypeUser, App.ModuleUser.Model.UserModel>(
    UserDatabaseKey.users,
    UserSchema
);
