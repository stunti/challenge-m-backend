import * as jwt from 'jsonwebtoken';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { debug } from 'console';
import { UserService } from '../../../user/service/user/user.service';
import { FirebaseService } from '../../../website/service/firebase/firebase.service';
import { IUser } from '../../../user/interface/user.interface';
import { CreateUserDto } from '../../../user/dto/ createUser.dto';
import { JwtPayload } from '../../interfaces/jwt-payload.interface';



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