import { Type } from 'class-transformer';
import { WgerEquipmentDto } from '../wger-equipment-dto/wger-equipment-dto';

export class WgerEquipmentResponseDto {
  count: number;
  previous: string;
  next: string;

  @Type(() => WgerEquipmentDto)
  results: WgerEquipmentDto[];
}
