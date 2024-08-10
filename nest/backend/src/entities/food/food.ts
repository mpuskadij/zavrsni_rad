import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserFood } from '../user_food/user_food';

@Entity()
export class Food {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  calories?: number;

  @Column({ nullable: true })
  total_fat?: number;

  @Column({ nullable: true })
  saturated_fat?: number;

  @Column({ nullable: true })
  cholesterol?: number;

  @Column({ nullable: true })
  sodium?: number;

  @Column({ nullable: true })
  total_carbohydrate?: number;

  @Column({ nullable: true })
  dietery_fiber?: number;

  @Column({ nullable: true })
  sugars?: number;

  @Column({ nullable: true })
  protein?: number;

  @Column({ nullable: true })
  potassium?: number;

  @OneToMany(() => UserFood, (userFood) => userFood.food, {
    cascade: ['insert', 'remove', 'update'],
  })
  userFoods: UserFood[];
}
