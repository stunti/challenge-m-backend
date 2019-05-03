import { Controller, UseGuards, HttpStatus, Response, Request, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiUseTags } from '@nestjs/swagger';
import { AuthService } from './service/auth/auth.service';
import { UserService } from '../user/service/user/user.service';
import { LoginUserDto } from '../user/dto/loginUser.dto';
import { IUser } from '../user/interface/user.interface';
import { CreateUserDto } from '../user/dto/ createUser.dto';


@ApiUseTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService,
                private readonly usersService: UserService) {}

    @Post('register')
    public async register(
        @Response() res, 
        @Body() createUserDto: CreateUserDto
    ){
        const result = await this.authService.register(createUserDto);
        
        if (result == null) {
            return res.status(HttpStatus.BAD_REQUEST).json(result);
        }
        return res.status(HttpStatus.OK).json(result);
    }

    @Post('login')
    @UseGuards(AuthGuard('local'))
    public async login(@Response() res, @Body() login: LoginUserDto){
        return await this.usersService
        .findOne(<IUser>{email: login.email})
        .then(user => {
            if (!user) {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                    message: 'User Not Found',
                });
            } else {
                console.log('start getting the token');
                const token = this.authService.createToken(user);
                console.log(token);
                return res.status(HttpStatus.OK).json(token);
            }
        });
    }
}