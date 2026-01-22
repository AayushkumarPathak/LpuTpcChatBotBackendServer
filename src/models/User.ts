import { model, Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";
const UserSchema = new Schema({
    regNo: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    dob: { type: String, required: true }, // Format: YYYY-MM-DD
    role: { type: String, enum: ['student', 'admin'], default: 'student' },
    isPasswordReset: { type: Boolean, default: false }
})

// Hash password before saving
UserSchema.pre('save', async function() {
    if (!this.isModified('password')) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare passwords
UserSchema.methods.matchPassword = async function(enteredPassword: string) {
    return await bcrypt.compare(enteredPassword, this.password);
};

export interface IUser extends Document {
    regNo: string;
    password?: string;
    name: string;
    dob: string;
    role: 'student' | 'admin';
    isPasswordReset: boolean;
    matchPassword(password: string): Promise<boolean>;
}

export default model<IUser>('User', UserSchema);