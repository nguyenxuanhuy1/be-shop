import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as fs from 'fs';
import { Repository } from 'typeorm';
import { CreateAccRegDto } from './dto/create-acc-reg.dto';
import { UpdateAccRegDto } from './dto/update-acc-reg.dto';
import { AccReg } from './entities/acc-reg.entity';
@Injectable()
export class AccRegService {

  constructor(
    @InjectRepository(AccReg)
    private repository: Repository<AccReg>,
  ) { }


  create(createAccRegDto: CreateAccRegDto) {
    const entity = this.repository.create(createAccRegDto);
    return this.repository.save(entity);
  }

  async findAll(page: number = 1, pageSize: number = 10): Promise<[AccReg[], number]> {
    const skip = (page - 1) * pageSize;

    const [items, total] = await this.repository.findAndCount({
      take: pageSize,
      skip,
    });
    return [items, total];
  }

  //type 2
  async findAllByType2(page: number = 1, pageSize: number = 10): Promise<[AccReg[], number]> {
    const type = 2;
    const skip = (page - 1) * pageSize;

    const items = await this.repository.find({
      where: { type },
      skip,
      take: pageSize,
    });

    const total = await this.repository.count({ where: { type } });

    return [items, total];
  }



  async findById(id: number, type: number) {
    return this.repository.findOne({ where: { id, type } });
  }


  async find() {
    return this.repository.find();
  }

  //type 1
  async findAllByType1(page: number = 1, pageSize: number = 10): Promise<[AccReg[], number]> {
    const type = 1;
    const skip = (page - 1) * pageSize;

    const items = await this.repository.find({
      where: { type },
      skip,
      take: pageSize,
    });

    const total = await this.repository.count({ where: { type } });

    return [items, total];
  }

  //type 3
  async findAllByType3(page: number = 1, pageSize: number = 4): Promise<[AccReg[], number]> {
    const type = 3;
    const skip = (page - 1) * pageSize;

    const items = await this.repository.find({
      where: { type },
      skip,
      take: pageSize,
    });

    const total = await this.repository.count({ where: { type } });

    return [items, total];
  }

  // type 4

  async findAllByType4(page: number = 1, pageSize: number = 4): Promise<[AccReg[], number]> {
    const type = 4;
    const skip = (page - 1) * pageSize;

    const items = await this.repository.find({
      where: { type },
      skip,
      take: pageSize,
    });

    const total = await this.repository.count({ where: { type } });

    return [items, total];
  }

  // search 
  async searchData(minPrice: number, maxPrice: number) {
    return this.repository
      .createQueryBuilder('entity')
      .where('entity.price >= :minPrice', { minPrice })
      .andWhere('entity.price <= :maxPrice', { maxPrice })
      .getMany();
  }

  update(id: number, updateAccRegDto: UpdateAccRegDto) {
    return `This action updates a #${id} accReg`;
  }

  async remove(id: number): Promise<void> {
    const entity = await this.repository.findOne({ where: { id: id } });

    if (!entity) {
      throw new NotFoundException(`không tìm thấy id:${id}`);
    }

    const filePath = 'E:/be-shop/public/upload/' + entity.img;

    console.log('Vừa xoá ảnh  và tên:', entity.img, 'với id', entity.id);

    try {
      // Xóa tệp 
      await fs.promises.unlink(filePath);

      // xóa bản ghi trong cơ sở dữ liệu
      await this.repository.remove(entity);
    } catch (error) {
      throw new Error(`lỗi: ${error.message}`);
    }
  }
}
