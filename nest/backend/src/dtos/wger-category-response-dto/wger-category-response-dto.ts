import { Type } from 'class-transformer';
import { WgerCategoryDto } from '../wger-category-dto/wger-category-dto';

export class WgerCategoryResponseDto {
  count: number;
  previous: string | null;
  next: string | null;

  @Type(() => WgerCategoryDto)
  results: WgerCategoryDto[];
}
