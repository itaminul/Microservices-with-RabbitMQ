import "reflect-metadata"; // Ensure this is at the top of your entry file
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("users") 
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: false })
  username?: string;

  @Column({ nullable: false })
  password?: string;

  @Column({ nullable: true })
  email?: number;

  @Column({ default: true})
  role_name?: string
}
