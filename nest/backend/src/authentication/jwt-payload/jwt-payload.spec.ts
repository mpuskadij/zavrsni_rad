import { JwtPayload } from './jwt-payload';

describe('JwtPayload', () => {
  it('should be defined', () => {
    expect(new JwtPayload('admin', 1)).toBeDefined();
  });
});
