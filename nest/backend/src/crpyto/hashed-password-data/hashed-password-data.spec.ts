import { HashedPasswordData } from './hashed-password-data';

describe('HashedPasswordData', () => {
  it('should be defined', () => {
    expect(new HashedPasswordData()).toBeDefined();
  });
});
