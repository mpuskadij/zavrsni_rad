import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../user/user';
import { Exercise } from '../exercise/exercise';

@Entity()
export class WorkoutPlan {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  title: string;

  @CreateDateColumn()
  dateAdded: Date;

  @ManyToOne(() => User, (user) => user.workoutPlans, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ referencedColumnName: 'username', name: 'username' })
  user: User;

  @ManyToMany(() => Exercise, {
    cascade: ['insert', 'remove', 'update'],
    eager: true,
  })
  @JoinTable()
  exercises: Exercise[];
}
