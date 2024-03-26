import { PartialType } from '@nestjs/swagger';
import { CreateAccRegDto } from './create-acc-reg.dto';

export class UpdateAccRegDto extends PartialType(CreateAccRegDto) {}
