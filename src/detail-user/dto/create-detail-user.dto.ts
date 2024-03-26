
import { ApiProperty } from "@nestjs/swagger";

export class CreateDetailUserDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    userId: number;

    @ApiProperty()
    productIds: string;

    @ApiProperty()
    productNames: string;

    @ApiProperty()
    quantity: string;

    @ApiProperty()
    price: number;

}
