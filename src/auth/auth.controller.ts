import {
  Controller, Get, Post, Body,
  BadRequestException, Res, Req,
  UnauthorizedException,
  UseGuards, Put, Param, ParseIntPipe, NotFoundException, Patch
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Response, Request, response } from 'express';
import { PassThrough } from 'stream';
import { request } from 'http';
import { ApiTags } from '@nestjs/swagger';
import { promises } from 'dns';
import { AuthGuard } from '@nestjs/passport';
import { Auth } from './entities/auth.entity';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private jwtService: JwtService,
    private readonly authService: AuthService) { }

  @Post('register')
  async register(
    @Body('name') name: string,
    @Body('password') password: string,
    @Body('email') email: string,
  ) {
    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltOrRounds)

    const user = await this.authService.create({
      name,
      email,
      password: hashedPassword,
    });
    delete user.password;
    return user;
  }
  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
    @Res({ passthrough: true }) respone: Response
  ) {
    const user = await this.authService.findOne({ where: { email: email } });

    if (!user) {
      throw new BadRequestException('sai tài khoản hoặc mật khẩu');
    }
    if (!await bcrypt.compare(password, user.password)) {
      throw new BadRequestException('sai tài khoản hoặc mật khẩu');
    }

    const jwt = await this.jwtService.signAsync({ id: user.id });
    respone.cookie('jwt', jwt, { httpOnly: true });

    return {
      message: "Đăng nhập thành công ^_^"
    };
  }

  @Get('user')
  async user(@Req() request: Request): Promise<any> {
    try {
      const cookie = request.cookies['jwt'];

      const data = await this.jwtService.verifyAsync(cookie);

      if (!data) {
        throw new UnauthorizedException('JWT không hợp lệ hoặc đã hết hạn');
      }

      const user = await this.authService.findOne({ where: { id: data['id'] } });

      const { password, ...result } = user;

      return result;

    } catch (e) {
      throw new UnauthorizedException(e.message);
    }
  }

  @Post('out')
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('jwt');
    return {
      message: 'Đăng xuất thành công'
    };
  }

  @Get('topSpent')
  async getTopSpentUsers(): Promise<Auth[]> {
    return this.authService.getTopSpentUsers();
  }


  @Patch('update-spent/:id')
  async updateSpent(
    @Param('id', ParseIntPipe) id: number,
    @Body('spentDifference') spentDifference: number,
    @Body('coinDifference') coinDifference: number,
  ): Promise<Auth> {
    return this.authService.updateSpentById(id, spentDifference, coinDifference);
  }
}
