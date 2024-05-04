import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";
import { OrderStatus } from "../enums/order-status.enum";

@Entity()
export class Order {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'jsonb', default: [] })
    products: any[];

    @Column()
    amount: number;

    @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PROCESSING })
    status: OrderStatus

    @CreateDateColumn()
    created: Date;
}
