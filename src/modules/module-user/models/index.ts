/**
 *
 * @author dongntd267@gmail.com on 26/07/2023.
 *
 */

/** types */
import { Model, QueryFilter } from 'mongoose';
/** libs */
import { model, Schema } from 'mongoose';

interface TypeUserModel extends Model<App.ModuleUser.Data.TypeUser> {
    getUser(payload: App.ModuleUser.Model.GetUser['Payload']): App.ModuleUser.Model.GetUser['Response'];
    getUsers(payload: App.ModuleUser.Model.GetUsers['Payload']): App.ModuleUser.Model.GetUsers['Response'];
    setUser(payload: App.ModuleUser.Model.SetUser['Payload']): App.ModuleUser.Model.SetUser['Response'];
    updateUser(payload: App.ModuleUser.Model.UpdateUser['Payload']): App.ModuleUser.Model.UpdateUser['Response'];
    deleteUser(payload: App.ModuleUser.Model.DeleteUser['Payload']): App.ModuleUser.Model.DeleteUser['Response'];
}

export const UserSchema = new Schema<App.ModuleUser.Data.TypeUser, TypeUserModel>(
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
    getUser: async function (payload: App.ModuleUser.Model.GetUser['Payload']): App.ModuleUser.Model.GetUser['Response'] {
        const { uid, email } = payload;
        const user = await this.findOne({
            $or: [...(email ? [{ email }] : []), ...(uid ? [{ uid }] : [])]
        }).exec();
        return user?.toObject({ versionKey: false }) ?? null;
    },
    getUsers: async function (payload: App.ModuleUser.Model.GetUsers['Payload']): App.ModuleUser.Model.GetUsers['Response'] {
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
    setUser: async function (payload: App.ModuleUser.Model.SetUser['Payload']): App.ModuleUser.Model.SetUser['Response'] {
        const { uid, email } = payload;
        const user = await this.create({
            uid,
            email,
            name: email?.split('@')[0].split('.')[0]
        });
        return user.toObject({ versionKey: false });
    },
    updateUser: async function (
        payload: App.ModuleUser.Model.UpdateUser['Payload']
    ): App.ModuleUser.Model.UpdateUser['Response'] {
        const { uid, data } = payload;
        const user = await this.findOneAndUpdate({ uid }, data, { returnDocument: 'after' }).exec();
        return user?.toObject({ versionKey: false }) ?? null;
    },
    deleteUser: async function (
        payload: App.ModuleUser.Model.DeleteUser['Payload']
    ): App.ModuleUser.Model.DeleteUser['Response'] {
        const { uid } = payload;
        await this.deleteOne({ uid }).exec();
        return true;
    }
};

export const UserModel = model<App.ModuleUser.Data.TypeUser, TypeUserModel>('Users', UserSchema);
