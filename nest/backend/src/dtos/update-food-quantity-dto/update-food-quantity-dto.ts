import {
  IsDecimal,
  IsInt,
  IsNumber,
  IsPositive,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

export class UpdateFoodQuantityDto {
  @IsInt()
  @IsPositive({ message: 'ID cannot be negative!' })
  id: number;

  @IsNumber({ allowInfinity: false, allowNaN: false, maxDecimalPlaces: 2 })
  @IsPositive({ message: 'Quantity cannot be negative!' })
  quantity: number;
}
