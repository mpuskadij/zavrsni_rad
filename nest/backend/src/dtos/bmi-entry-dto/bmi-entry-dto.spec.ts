import { BmiEntryDto } from './bmi-entry-dto';

describe('BmiEntryDto', () => {
  it('should be defined', () => {
    expect(new BmiEntryDto(20.5, new Date())).toBeDefined();
  });
});
