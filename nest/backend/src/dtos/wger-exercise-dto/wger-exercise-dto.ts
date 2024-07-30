import { Exclude, Type } from 'class-transformer';
import { WgerMuscleDto } from '../wger-muscle-dto/wger-muscle-dto';
import { WgerEquipmentDto } from '../wger-equipment-dto/wger-equipment-dto';
import { WgerCategoryDto } from '../wger-category-dto/wger-category-dto';
import { WgerVariatonDto } from '../wger-variaton-dto/wger-variaton-dto';

export class WgerExerciseDto {
  @Exclude()
  id: number;

  @Exclude()
  uuid: string;

  name: string;

  @Exclude()
  exercise_base: number;

  description: string;

  @Exclude()
  created: string;

  @Exclude()
  category: number | WgerCategoryDto;

  @Exclude()
  muscles: number[] | WgerMuscleDto[];

  @Exclude()
  muscles_secondary: number[] | WgerMuscleDto[];

  @Exclude()
  equipment: number[] | WgerEquipmentDto[];

  @Exclude()
  language: number;

  @Exclude()
  license: number;

  @Exclude()
  license_author: string;

  @Exclude()
  variations: number[] | WgerVariatonDto[];

  @Exclude()
  author_history: string[];
}
