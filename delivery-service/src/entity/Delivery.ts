import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("Delivery")
export class Delivery {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  usersId?: number;

  @Column()
  orderId?: number;

  @Column()
  product?: string;

  @Column()
  quantity?: number;

  @Column()
  status?: string;

  @Column({ type: 'varchar', default: 'PENDING' })
  customerDeliveryStatus?: string;

}
