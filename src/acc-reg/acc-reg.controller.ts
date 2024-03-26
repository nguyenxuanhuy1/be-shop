import { Controller, Get, Post, Body, Patch, Param, Delete, Query, NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
import { AccRegService } from './acc-reg.service';
import { CreateAccRegDto } from './dto/create-acc-reg.dto';
import { UpdateAccRegDto } from './dto/update-acc-reg.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('acc-reg')
@Controller('acc-reg')
export class AccRegController {
  constructor(private readonly accRegService: AccRegService) { }

  @Post()
  create(@Body() createAccRegDto: CreateAccRegDto) {
    return this.accRegService.create(createAccRegDto);
  }

  @Get('hi')
  async find() {
    return this.accRegService.find();
  }


  // trường type bằng 2
  @Get()
  async findAllByType2(
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 2,
  ) {
    const [items, total] = await this.accRegService.findAllByType2(page, pageSize);

    return { items, total };
  }

  // trường type =1

  @Get('type1')
  async findAllByType1(
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 2,
  ) {
    const [items, total] = await this.accRegService.findAllByType1(page, pageSize);

    return { items, total };
  }

  // trường type =3
  @Get('type3')
  async findAllByType3(
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 2,
  ) {
    const [items, total] = await this.accRegService.findAllByType3(page, pageSize);

    return { items, total };
  }

  // trường type =4
  @Get('type4')
  async findAllByType4(
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 2,
  ) {
    const [items, total] = await this.accRegService.findAllByType4(page, pageSize);

    return { items, total };
  }

  // search
  @Get('search')
  async search(@Query('minPrice') minPrice: number, @Query('maxPrice') maxPrice: number) {
    const result = await this.accRegService.searchData(minPrice, maxPrice);
    return result;
  }

  @Get('ALL')
  async findAll(
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 2,
  ) {
    const [items, total] = await this.accRegService.findAll(page, pageSize);
    return { items, total };
  }



  @Get(':id')
  async findById(@Param('id') id: number, @Param('type') type: number) {
    const result = await this.accRegService.findById(id, type);
    if (!result) {
      throw new NotFoundException(`Record with id ${id} and type ${type} not found.`);
    }
    return result;
  }


  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAccRegDto: UpdateAccRegDto) {
    return this.accRegService.update(+id, updateAccRegDto);
  }

  @Delete(':id')
  async deleteEntity(@Param('id') id: number) {
    return await this.accRegService.remove(id);
  }
}

