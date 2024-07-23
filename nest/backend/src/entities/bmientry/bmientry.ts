import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../user/user';

@Entity()
export class Bmientry {
  @PrimaryColumn()
  username: string;

  @PrimaryColumn()
  dateAdded: Date;

  @ManyToOne(() => User, (user) => user.bmiEntries)
  user: User;

  @Column()
  bmi: number;
}
