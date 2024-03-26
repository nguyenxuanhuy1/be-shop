import { Module } from '@nestjs/common';
import { DetailUserService } from './detail-user.service';
import { DetailUserController } from './detail-user.controller';
import { DetailUser } from './entities/detail-user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([DetailUser])],
  controllers: [DetailUserController],
  providers: [DetailUserService],
})
export class DetailUserModule { }
