import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Food } from '../food/food';
import { User } from '../user/user';

@Entity()
export class UserFood {
  @PrimaryColumn()
  username: string;

  @PrimaryColumn()
  foodId: number;

  @ManyToOne(() => Food, (food) => food.userFoods, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ referencedColumnName: 'id', name: 'foodId' })
  food: Food;

  @ManyToOne(() => User, (user) => user.userFoods, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ referencedColumnName: 'username', name: 'username' })
  user: User;

  @Column('decimal', { scale: 1, precision: 3, nullable: true })
  quantity: number;
}
