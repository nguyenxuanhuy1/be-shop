import { Module } from '@nestjs/common';
import { AccRegService } from './acc-reg.service';
import { AccRegController } from './acc-reg.controller';
import { AccReg } from './entities/acc-reg.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([AccReg])],
  controllers: [AccRegController],
  providers: [AccRegService],
})
export class AccRegModule { }
