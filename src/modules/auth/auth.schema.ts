import { Prop, SchemaFactory,Schema } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';


export type AuthDocument = HydratedDocument<Auth>;

export enum Role {
    ADMIN = 1,
    USER = 2,
    SUPER_ADMIN = 3,
    PARTNER = 4,
    AGENCY = 5,
}

@Schema({ timestamps: true })
export class Auth  {
    @Prop({required: true, unique: true})
    email: string;
    @Prop({required: true})
    password: string;
    @Prop({required: true, enum: Role, default: Role.USER})
    role: Role;
    @Prop({required: true})
    phone: string;
    @Prop({default: false})
    isPhoneVerified: boolean;
    @Prop({default: false})
    isEmailVerified: boolean;
    @Prop()
    phoneVerificationCode: string;
    @Prop()
    emailVerificationCode: string;
    @Prop()
    phoneVerificationCodeExpiry: Date;
    @Prop()
    emailVerificationCodeExpiry: Date;
}




export const AuthSchema = SchemaFactory.createForClass(Auth);

AuthSchema.pre('save', function (next) {
    const user = this;
    if (!user.isModified('password')) return next();
    user.password = bcrypt.hashSync(user.password, 10);
    next();
});

AuthSchema.methods.comparePassword = function (password: string) {
    return bcrypt.compareSync(password, this.password);
};

AuthSchema.set('toJSON', {
    transform: function (doc, ret, options) {
        delete ret.password;
        return ret;
    }
});

