import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, ValidateNested } from 'class-validator';
import { UpdateFoodQuantityDto } from '../update-food-quantity-dto/update-food-quantity-dto';

export class UpdateFoodQuantityBodyDto {
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayNotEmpty()
  @Type(() => UpdateFoodQuantityDto)
  foods: UpdateFoodQuantityDto[];
}
