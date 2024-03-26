import { ApiProperty } from "@nestjs/swagger";

export class CreateAccRegDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    gem: number;

    @ApiProperty()
    skin: number;

    @ApiProperty()
    price: number;

    @ApiProperty()
    generals: number;

    @ApiProperty()
    rank: string;

    @ApiProperty()
    status: string;

    @ApiProperty()
    img: string;

    @ApiProperty()
    type: number;

    @ApiProperty()
    add: number;

}
