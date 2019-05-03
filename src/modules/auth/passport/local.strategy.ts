import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../../user/service/user/user.service';
import { AuthService } from '../service/auth/auth.service';
import { IUser } from '../../user/interface/user.interface';



@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly userService: UserService,
        private readonly authService: AuthService,
    ) {
        super({
            usernameField: 'email',
            passwordField: 'password',
        }, 
        async (username: string, password: string, next: Function) => await this.validate(username, password, next));
    }
    

    async validate(username: string, password: string, done: Function) {
        console.log("validate", username, password);

        const user = await this.authService.authenticate(<IUser>{
            email: username,
            password: password,
        });

        if (!user) {
            return done(new UnauthorizedException(), false);
        }
        done(null, user);
    }
}