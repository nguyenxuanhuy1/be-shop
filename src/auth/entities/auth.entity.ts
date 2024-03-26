import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

enum Roles {
    ADNIN = 'ADMIN',
    USER = 'USER'
}

@Entity()

export class Auth {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    password: string;

    @Column()
    email: string;

    @Column({ default: 0.0 })
    coin: number

    @Column({ default: 0.0 })
    spent: number

    @Column({ default: Roles.USER })
    role: Roles;

}

