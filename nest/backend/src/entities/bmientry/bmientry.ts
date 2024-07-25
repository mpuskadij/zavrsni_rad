import {
  Column,
  CreateDateColumn,
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

  @ManyToOne(() => User, (user) => user.bmiEntries, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ referencedColumnName: 'username', name: 'username' })
  user: User;

  @Column('decimal', { precision: 3, scale: 1 })
  bmi: number;
}
