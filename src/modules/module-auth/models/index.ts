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
    get: async function (payload: App.ModuleAuth.Model.Auths['Get']['Payload']): App.ModuleAuth.Model.Auths['Get']['Return'] {
        const { uid } = payload;
        const Auth = await this.findOne({ $or: [{ uid }] }).exec();
        return Auth ? Auth.toObject({ versionKey: false }) : Auth;
    },
    getToken: async function (
        payload: App.ModuleAuth.Model.Auths['GetToken']['Payload']
    ): App.ModuleAuth.Model.Auths['GetToken']['Return'] {
        const { uid } = payload;
        const Auth = await this.findOne({ uid }).exec();
        return Auth ? Auth.toObject({ versionKey: false }).refreshToken : null;
    },
    create: async function (
        payload: App.ModuleAuth.Model.Auths['Create']['Payload']
    ): App.ModuleAuth.Model.Auths['Create']['Return'] {
        const { uid, password } = payload;
        const hash = bcrypt.hashSync(password, 10);
        const Auth = new this({
            uid,
            password: hash,
            refreshToken: genToken(uid, AppKey.refreshToken)
        });
        return Auth.toObject({ versionKey: false });
    },
    update: async function (
        payload: App.ModuleAuth.Model.Auths['Update']['Payload']
    ): App.ModuleAuth.Model.Auths['Update']['Return'] {
        const { data } = payload;
        const Auth = await this.findOneAndUpdate({ uid: data.uid }, data, { returnDocument: 'after' }).exec();
        return Auth ? Auth.toObject({ versionKey: false }) : Auth;
    },
    delete: async function (
        payload: App.ModuleAuth.Model.Auths['Delete']['Payload']
    ): App.ModuleAuth.Model.Auths['Delete']['Return'] {
        const { uid } = payload;
        await this.deleteOne({ uid }).exec();
        return true;
    }
};

export const AuthModel = model<App.ModuleAuth.Data.TypeAuth, App.ModuleAuth.Model.AuthModel>(
    AuthDatabaseKey.auths,
    AuthSchema
);
