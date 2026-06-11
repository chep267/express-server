/**
 *
 * @author dongntd267@gmail.com on 26/07/2023.
 *
 */

/** libs */
import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';

/** constants */
import { AppKey } from '@module-base/constants/AppKey';
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
        const { id } = payload;
        return await this.findOne({ $or: [{ id }] })
            .select('-_id -__v')
            .lean()
            .exec();
    },
    getToken: async function (
        payload: App.ModuleAuth.Model.AuthModelAction['GetToken']['Payload']
    ): App.ModuleAuth.Model.AuthModelAction['GetToken']['Return'] {
        const { id } = payload;
        const auth = await this.findOne({ id }).select('-_id -__v').lean().exec();
        return auth?.refreshToken ?? null;
    },
    create: async function (
        payload: App.ModuleAuth.Model.AuthModelAction['Create']['Payload']
    ): App.ModuleAuth.Model.AuthModelAction['Create']['Return'] {
        const { id, password } = payload;
        const hash = bcrypt.hashSync(password, 10);
        const auth = await new this({
            id,
            password: hash,
            refreshToken: genToken(id, AppKey.refreshToken)
        }).save();

        return auth.toObject();
    },
    update: async function (
        payload: App.ModuleAuth.Model.AuthModelAction['Update']['Payload']
    ): App.ModuleAuth.Model.AuthModelAction['Update']['Return'] {
        const { id, data } = payload;
        const auth = await this.findOneAndUpdate({ id }, data, {
            returnDocument: 'after',
            lean: true,
            projection: { _id: 0, __v: 0 }
        }).exec();
        return auth ?? null;
    },
    delete: async function (
        payload: App.ModuleAuth.Model.AuthModelAction['Delete']['Payload']
    ): App.ModuleAuth.Model.AuthModelAction['Delete']['Return'] {
        const { id } = payload;
        await this.deleteOne({ id }).exec();
        return true;
    }
};

export const AuthModel = model<App.ModuleAuth.Data.TypeAuth, App.ModuleAuth.Model.AuthModel>(
    AuthDatabaseKey.auths,
    AuthSchema
);
