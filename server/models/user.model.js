/**
 *
 * @author dongntd267@gmail.com on 26/07/2023.
 *
 */
/** libs */
import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';
export const UserSchema = new Schema({
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
}, {
    timestamps: true
});
UserSchema.statics = {
    getUser: async function (payload) {
        const { email, uid } = payload;
        const user = await this.findOne({ $or: [{ email }, { uid }] }).exec();
        return user ? user.toObject({ versionKey: false }) : user;
    },
    setUser: async function (payload) {
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
    updateUser: async function (payload, options) {
        const { uid, data } = payload;
        const { returnOriginal = false } = options ?? {};
        const user = await this.findOneAndUpdate({ uid }, data, { returnOriginal }).exec();
        return user ? user.toObject({ versionKey: false }) : user;
    },
    deleteUser: async function (payload) {
        const { uid } = payload;
        await this.deleteOne({ uid }).exec();
        return true;
    },
    getRefreshToken: async function (payload) {
        const { uid } = payload;
        const user = await this.findOne({ uid }).exec();
        return user ? user.toObject({ versionKey: false }).refreshToken : undefined;
    }
};
export const UserModel = model('Users', UserSchema);
