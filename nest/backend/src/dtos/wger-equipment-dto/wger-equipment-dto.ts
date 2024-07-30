import { Exclude } from 'class-transformer';

export class WgerEquipmentDto {
  @Exclude()
  id: number;

  name: string;
}
