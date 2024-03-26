import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Auth } from './entities/auth.entity';
import { Repository } from 'typeorm';
import { promises } from 'dns';

@Injectable()
export class AuthService {
  constructor(

    @InjectRepository(Auth) private readonly authRepository: Repository<Auth>
  ) {
  }

  async create(data: any): Promise<Auth> {
    return this.authRepository.save(data);
  }
  async findOne(condition: any): Promise<Auth> {
    return this.authRepository.findOne(condition);
  }

  async getTopSpentUsers(): Promise<Auth[]> {
    const users = await this.authRepository
      .createQueryBuilder('auth')
      .orderBy('auth.spent', 'DESC')
      .take(3)
      .getMany();

    // Loại bỏ trường password trước khi trả về
    users.forEach(user => delete user.password);

    return users;
  }

  async updateSpentById(id: number, spentDifference: number, coinDifference: number): Promise<Auth> {
    const user = await this.authRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('Người dùng không tồn tại');
    }

    if (user.coin < coinDifference) {
      console.log(user.coin)
      throw new BadRequestException('Số coin không đủ để thực hiện giao dịch');
    }

    user.spent += spentDifference;
    user.coin -= coinDifference;

    await this.authRepository.save(user);

    return user;
  }

}
