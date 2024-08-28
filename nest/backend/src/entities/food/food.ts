import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserFood } from '../user_food/user_food';

@Entity()
export class Food {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  nixId: string;

  @Column('decimal', { scale: 1, precision: 5, nullable: true })
  calories?: number;

  @Column('decimal', { scale: 1, precision: 5, nullable: true })
  total_fat?: number;

  @Column('decimal', { scale: 1, precision: 5, nullable: true })
  saturated_fat?: number;

  @Column('decimal', { scale: 1, precision: 5, nullable: true })
  cholesterol?: number;

  @Column('decimal', { scale: 1, precision: 5, nullable: true })
  sodium?: number;

  @Column('decimal', { scale: 1, precision: 5, nullable: true })
  total_carbohydrate?: number;

  @Column('decimal', { scale: 1, precision: 5, nullable: true })
  dietery_fiber?: number;

  @Column('decimal', { scale: 1, precision: 5, nullable: true })
  sugars?: number;

  @Column('decimal', { scale: 1, precision: 5, nullable: true })
  protein?: number;

  @Column('decimal', { scale: 1, precision: 5, nullable: true })
  potassium?: number;

  @OneToMany(() => UserFood, (userFood) => userFood.food, {
    cascade: ['insert', 'remove', 'update'],
  })
  userFoods: UserFood[];
}
