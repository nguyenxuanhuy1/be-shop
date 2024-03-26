import { Injectable } from '@nestjs/common';
import { CreateDetailUserDto } from './dto/create-detail-user.dto';
import { UpdateDetailUserDto } from './dto/update-detail-user.dto';
import { Repository, getRepository } from 'typeorm';
import { DetailUser } from './entities/detail-user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class DetailUserService {
  constructor(
    @InjectRepository(DetailUser)
    private readonly detailUserRepository: Repository<DetailUser>,
  ) { }

  async createDetailUser(productData: any[], userId: number, totalPrice: number, totalQuantity: number, date: string): Promise<DetailUser> {
    const detailUser = new DetailUser();
    detailUser.userId = userId;
    detailUser.productData = productData;
    detailUser.totalPrice = totalPrice;
    detailUser.totalQuantity = totalQuantity;
    detailUser.date = date;

    return await this.detailUserRepository.save(detailUser);
  }
}
