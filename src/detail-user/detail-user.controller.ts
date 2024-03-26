import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DetailUserService } from './detail-user.service';
import { CreateDetailUserDto } from './dto/create-detail-user.dto';
import { UpdateDetailUserDto } from './dto/update-detail-user.dto';

@Controller('detail-user')
export class DetailUserController {
  constructor(private readonly detailUserService: DetailUserService) { }

  @Post()
  async createDetailUser(@Body() body: any) {
    const { productData, userId, totalPrice, totalQuantity, date } = body;
    return await this.detailUserService.createDetailUser(productData, userId, totalPrice, totalQuantity, date);
  }

}
