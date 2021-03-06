import { Injectable } from '@nestjs/common';
import { IUserService } from '../../interface/iuserService.interface';
import { FirebaseService } from '../../../website/service/firebase/firebase.service';
import { IUser } from '../../interface/user.interface';
import { CreateUserDto } from '../../dto/ createUser.dto';

@Injectable()
export class UserService implements IUserService {
    constructor(
        private readonly fbService: FirebaseService
        // @InjectModel('User') private readonly userModel: PassportLocalModel<IUser>
    ) {}
    
    async findAll(): Promise<IUser[]> {
        return this.fbService
        .getApp()
        .database()
        .ref("users")
        .once("value")
        
        // return await this.userModel.find().exec();
    }

    async findOne(user: IUser): Promise<IUser> {
        return this.fbService
        .getApp()
        .database()
        .ref("users")
        .orderByChild("email")
        .equalTo(user.email)
        .once("value")
        .then(snapshot => {
            const snap = snapshot.val();
            
            for (let key in snap) {
                const res = snap[key];
                res['id'] = key;
                return res;
            }
        });
       
    }

    async findById(ID: string): Promise<IUser> {
        return await this.fbService
        .getApp()
        .database()
        .ref("users/" + ID)
        .once("value")
        .then(snapshot => {
            const snap = snapshot.val();
            
            snap['id'] = ID;
            return snap;
        });
        
    }
    async create(createUserDto: CreateUserDto): Promise<IUser> {
        return await this.fbService
        .getApp()
        .database()
        .ref("users")
        .push()
        .set(createUserDto);
    }

    async update(ID: number, newValue: IUser): Promise<IUser> {
        return await this.fbService
        .getApp()
        .database()
        .ref("users/_id/" + ID)
        .update(newValue)
    }
    async delete(ID: number): Promise<string> {
        return await this.fbService
        .getApp()
        .database()
        .ref("users/_id/" + ID)
    }
}