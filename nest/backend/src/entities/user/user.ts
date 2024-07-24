import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { Bmientry } from '../bmientry/bmientry';

@Entity()
export class User {
  @PrimaryColumn({ length: 25 })
  username: string;

  @Column({ nullable: false })
  password: string;

  @Column({ default: 0, nullable: true })
  isAdmin: number;

  @OneToMany(() => Bmientry, (bmiEntry) => bmiEntry.user, {
    cascade: ['insert', 'remove'],
  })
  bmiEntries: Bmientry[];
}
