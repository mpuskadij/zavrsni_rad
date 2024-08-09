import { IsNotEmpty, IsString, MinLength, ValidateIf } from 'class-validator';

export class FindFoodDetailsDto {
  @ValidateIf((data) => !data.id || data.name)
  @IsNotEmpty({ message: 'Name or id are required!' })
  name: string;

  @ValidateIf((data) => !data.name || data.id)
  @IsNotEmpty({ message: 'Name or id are required!' })
  id: string;
}
