/**
 *
 * @author dongntd267@gmail.com on 26/07/2023.
 *
 */

/** libs */
import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';

/** constants */
import { AppKey } from '@module-base/constants/key';
import { AuthDatabaseKey } from '@module-auth/constants/key';

/** utils */
import { genToken } from '@module-auth/utils/token';

export const AuthSchema = new Schema<App.ModuleAuth.Data.TypeAuth, App.ModuleAuth.Model.AuthModel>(
    {
        id: {
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
        timestamps: true,
        toObject: {
            versionKey: false
        }
    }
);

AuthSchema.statics = {
    get: async function (
        payload: App.ModuleAuth.Model.AuthModelAction['Get']['Payload']
    ): App.ModuleAuth.Model.AuthModelAction['Get']['Return'] {
        const { uid } = payload;
        return await this.findOne({ $or: [{ id: uid }] })
            .select('-_id -__v')
            .lean()
            .exec();
    },
    getToken: async function (
        payload: App.ModuleAuth.Model.AuthModelAction['GetToken']['Payload']
    ): App.ModuleAuth.Model.AuthModelAction['GetToken']['Return'] {
        const { uid } = payload;
        const auth = await this.findOne({ id: uid }).select('-_id -__v').lean().exec();
        return auth?.refreshToken ?? null;
    },
    create: async function (
        payload: App.ModuleAuth.Model.AuthModelAction['Create']['Payload']
    ): App.ModuleAuth.Model.AuthModelAction['Create']['Return'] {
        const { uid, password } = payload;
        const hash = bcrypt.hashSync(password, 10);
        const auth = await new this({
            id: uid,
            password: hash,
            refreshToken: genToken(uid, AppKey.refreshToken)
        }).save();

        return auth.toObject();
    },
    update: async function (
        payload: App.ModuleAuth.Model.AuthModelAction['Update']['Payload']
    ): App.ModuleAuth.Model.AuthModelAction['Update']['Return'] {
        const { uid, data } = payload;
        const auth = await this.findOneAndUpdate({ id: uid }, data, {
            returnDocument: 'after',
            lean: true,
            projection: { _id: 0, __v: 0 }
        }).exec();
        return auth ?? null;
    },
    delete: async function (
        payload: App.ModuleAuth.Model.AuthModelAction['Delete']['Payload']
    ): App.ModuleAuth.Model.AuthModelAction['Delete']['Return'] {
        const { uid } = payload;
        await this.deleteOne({ id: uid }).exec();
        return true;
    }
};

export const AuthModel = model<App.ModuleAuth.Data.TypeAuth, App.ModuleAuth.Model.AuthModel>(
    AuthDatabaseKey.auths,
    AuthSchema
);
