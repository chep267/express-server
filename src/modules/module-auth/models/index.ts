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

/** utils */
import { genToken } from '@module-auth/utils/token';

/** types */
import type { Model } from 'mongoose';

interface TypeAuthModel extends Model<App.ModuleAuth.Data.TypeAuth> {
    getAuth(payload: App.ModuleAuth.Model.GetAuth['Payload']): App.ModuleAuth.Model.GetAuth['Response'];
    setAuth(payload: App.ModuleAuth.Model.SetAuth['Payload']): App.ModuleAuth.Model.SetAuth['Response'];
    updateAuth(payload: App.ModuleAuth.Model.UpdateAuth['Payload']): App.ModuleAuth.Model.UpdateAuth['Response'];
    deleteAuth(payload: App.ModuleAuth.Model.DeleteAuth['Payload']): App.ModuleAuth.Model.DeleteAuth['Response'];
    getRefreshToken(
        payload: App.ModuleAuth.Model.GetRefreshToken['Payload']
    ): App.ModuleAuth.Model.GetRefreshToken['Response'];
}

export const AuthSchema = new Schema<App.ModuleAuth.Data.TypeAuth, TypeAuthModel>(
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
    getAuth: async function (payload: App.ModuleAuth.Model.GetAuth['Payload']): App.ModuleAuth.Model.GetAuth['Response'] {
        const { uid } = payload;
        const Auth = await this.findOne({ $or: [{ uid }] }).exec();
        return Auth ? Auth.toObject({ versionKey: false }) : Auth;
    },
    setAuth: async function (payload: App.ModuleAuth.Model.SetAuth['Payload']): App.ModuleAuth.Model.SetAuth['Response'] {
        const { uid, password } = payload;
        const hash = bcrypt.hashSync(password, 10);
        const Auth = await this.create({
            uid,
            password: hash,
            refreshToken: genToken(uid, AppKey.refreshToken)
        });
        return Auth.toObject({ versionKey: false });
    },
    updateAuth: async function (
        payload: App.ModuleAuth.Model.UpdateAuth['Payload']
    ): App.ModuleAuth.Model.UpdateAuth['Response'] {
        const { uid, data } = payload;
        const Auth = await this.findOneAndUpdate({ uid }, data, { returnDocument: 'after' }).exec();
        return Auth ? Auth.toObject({ versionKey: false }) : Auth;
    },
    deleteAuth: async function (
        payload: App.ModuleAuth.Model.DeleteAuth['Payload']
    ): App.ModuleAuth.Model.DeleteAuth['Response'] {
        const { uid } = payload;
        await this.deleteOne({ uid }).exec();
        return true;
    },
    getRefreshToken: async function (
        payload: App.ModuleAuth.Model.GetRefreshToken['Payload']
    ): App.ModuleAuth.Model.GetRefreshToken['Response'] {
        const { uid } = payload;
        const Auth = await this.findOne({ uid }).exec();
        return Auth ? Auth.toObject({ versionKey: false }).refreshToken : null;
    }
};

export const AuthModel = model<App.ModuleAuth.Data.TypeAuth, TypeAuthModel>('Auths', AuthSchema);
