import { User } from './user';
import { Bmientry } from '../bmientry/bmientry';

describe('User', () => {
  it('should be defined', () => {
    expect(new User()).toBeDefined();
  });
});
