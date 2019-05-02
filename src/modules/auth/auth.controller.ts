import { Controller, UseGuards, HttpStatus, Response, Request, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiUseTags } from '@nestjs/swagger';

import { AuthService } from 'modules/auth/service/auth/auth.service';
import { UserService } from 'modules/user/service/user/user.service';
import { CreateUserDto } from 'modules/user/dto/ createUser.dto';
import { LoginUserDto } from 'modules/user/dto/loginUser.dto';
import { IUser } from 'modules/user/interface/user.interface';

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