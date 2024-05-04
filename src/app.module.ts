import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccRegModule } from './acc-reg/acc-reg.module';
import { AccReg } from './acc-reg/entities/acc-reg.entity';
import { FilesModule } from './files/files.module';
import { MulterModule } from '@nestjs/platform-express';
import { AuthModule } from './auth/auth.module';
import { Auth } from './auth/entities/auth.entity';
import { DetailUserModule } from './detail-user/detail-user.module';
import { DetailUser } from './detail-user/entities/detail-user.entity';
import { OrdersModule } from './orders/orders.module';
import { Order } from './orders/entities/order.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '123456',
      database: 'DBLQ',
      entities: [AccReg, Auth, DetailUser, Order],
      // logging: ['query', 'warn', 'error'],
      synchronize: true,
    }),
    AccRegModule,
    FilesModule,
    MulterModule.register({ dest: './public/upload' }),
    AuthModule,
    DetailUserModule,
    OrdersModule,
  ],
})
export class AppModule { }
