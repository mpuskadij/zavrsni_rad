import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryColumn({ length: 25 })
  username: string;

  @Column({ nullable: false })
  password: string;

  @Column({ default: 0 })
  isAdmin: number;
}
