import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const UserSchema = new Schema({
    userName: { type: String, required: true },
    userEmail: { type: String, required: true, unique: true },
    userPassword: { type: String, required: true },
}, {
    timestamps: true,
});

const UserModel = model('User', UserSchema);

export default UserModel;