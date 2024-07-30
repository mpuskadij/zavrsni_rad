import { Exclude } from 'class-transformer';

export class WgerCategoryDto {
  @Exclude()
  id: number;

  name: string;
}
