import { Injectable, NotAcceptableException } from '@nestjs/common';

@Injectable()
export class BmiService {
  async addNewBmiEntry(weight: number, height: number): Promise<boolean> {
    if (weight <= 0 || height <= 0) {
      throw new NotAcceptableException('Weight cannot be 0 or less than 0!');
    }
    return true;
  }
}
