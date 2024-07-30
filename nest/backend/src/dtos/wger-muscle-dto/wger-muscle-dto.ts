import { Exclude } from 'class-transformer';

export class WgerMuscleDto {
  @Exclude()
  id: number;

  @Exclude()
  name: string;

  name_en: string;

  @Exclude()
  is_front: boolean;

  @Exclude()
  image_url_main: string;

  @Exclude()
  image_url_secondary: string;
}
