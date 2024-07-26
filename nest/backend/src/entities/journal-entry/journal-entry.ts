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
export class JournalEntry {
  @PrimaryColumn()
  username: string;

  @PrimaryColumn()
  dateAdded: Date;

  @Column()
  title: string;

  @Column()
  description: string;

  @ManyToOne(() => User, (user) => user.journalEntries, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ referencedColumnName: 'username', name: 'username' })
  user: User;
}
