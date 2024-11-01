import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity('Order')
export class Order {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  usersId?: number;

  @Column()
  product?: string;

  @Column()
  quantity?: number;
}
