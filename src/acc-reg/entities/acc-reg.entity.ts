import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()

export class AccReg {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    gem: number;

    @Column()
    skin: number;

    @Column()
    price: number;

    @Column()
    generals: number;

    @Column()
    rank: string;

    @Column()
    status: string;

    @Column()
    img: string;

    @Column()
    type: number;

    @Column()
    add: number;

}
