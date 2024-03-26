import { PartialType } from '@nestjs/swagger';
import { CreateDetailUserDto } from './create-detail-user.dto';

export class UpdateDetailUserDto extends PartialType(CreateDetailUserDto) {}
