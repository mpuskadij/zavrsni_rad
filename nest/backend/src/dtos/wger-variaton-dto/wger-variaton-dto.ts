export class WgerVariatonDto {}
import { Exclude, Type } from 'class-transformer';
import { WgerMuscleDto } from '../wger-muscle-dto/wger-muscle-dto';
import { WgerEquipmentDto } from '../wger-equipment-dto/wger-equipment-dto';
import { WgerCategoryDto } from '../wger-category-dto/wger-category-dto';

export class WgerExerciseDto {
  @Exclude()
  id: number;

  @Exclude()
  uuid: string;

  name: string;

  @Exclude()
  exercise_base: number;

  @Exclude()
  description: string;

  @Exclude()
  created: string;

  @Exclude()
  category: number;

  @Exclude()
  muscles: number[];

  @Exclude()
  muscles_secondary: number[];

  @Exclude()
  equipment: number[];

  @Exclude()
  language: number;

  @Exclude()
  license: number;

  @Exclude()
  license_author: string;

  @Exclude()
  variations: number[];

  @Exclude()
  author_history: string[];
}
