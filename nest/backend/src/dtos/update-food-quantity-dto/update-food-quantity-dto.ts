import { IsDecimal, IsNumber, IsPositive } from 'class-validator';

export class UpdateFoodQuantityDto {
  @IsNumber({ allowInfinity: false, allowNaN: false, maxDecimalPlaces: 2 })
  @IsPositive({ message: 'Quantity cannot be negative!' })
  quantity: number;
}
