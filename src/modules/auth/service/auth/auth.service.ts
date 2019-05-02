import * as jwt from 'jsonwebtoken';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
// import { Model, PassportLocalModel } from 'mongoose';
// import { InjectModel } from '@nestjs/mongoose';
import { debug } from 'console';
import { IUser } from 'modules/user/interface/user.interface';
import { RegistrationStatus } from 'modules/auth/interfaces/registrationStatus.interface';
import { UserService } from 'modules/user/service/user/user.service';
import { JwtPayload } from 'modules/auth/interfaces/jwt-payload.interface';
import { FirebaseService } from 'modules/website/service/firebase/firebase.service';
import { CreateUserDto } from 'modules/user/dto/ createUser.dto';


@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UserService,
        private readonly fbService: FirebaseService
        // @InjectModel('User') private readonly userModel: PassportLocalModel<IUser>
    ) { }

    async register(user: CreateUserDto): Promise<IUser> {
        const exists = await this.usersService.findOne(user);
       
        if (exists == null || exists.email != user.email) {
            await this.usersService.create(user);
            return await this.usersService.findOne(user);
        } else {
            return exists;
        }
    }

    createToken(user) {
        console.log('get the expiration');
        const expiresIn = 3600;
        console.log('sign the token');
        console.log(user);

        const accessToken = jwt.sign(
            { 
                id: user.id,
                email: user.email,
                firstname: user.firstName,
                lastname: user.lastName 
            }, 
            'ManulifeRocks', 
            { expiresIn }
        );
        console.log('return the token');
        console.log(accessToken);
        return {
            expiresIn,
            accessToken,
        };
    }
    
    async validateUser(payload: JwtPayload): Promise<any> {
        return await this.usersService.findById(payload.id);
    }

    async authenticate(user: IUser): Promise<any> {
        const exists = await this.usersService.findOne(user);

        if (exists.password == user.password) {
            return exists;
        }
        return null;
    }
        
}