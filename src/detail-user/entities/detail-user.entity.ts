
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class DetailUser {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: number;

    @Column({ type: 'jsonb', nullable: true })
    productData: any;

    @Column()
    totalPrice: number;

    @Column()
    totalQuantity: number;


    @Column({ nullable: true })
    //@Column({ type: 'date' })
    date: string;

}
