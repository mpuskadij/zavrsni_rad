import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { HttpException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should exist', async () => {
      const result = await controller.register('abc', 'A');
      expect(result).not.toBeNull();
    });

    it('should throw exception if no username is passed', async () => {
      const result = controller.register('', '');
      expect(result).rejects.toThrow(HttpException);
    });

    it('should throw exception if username is a number', async () => {
      const result = controller.register('1', '');
      expect(result).rejects.toThrow(HttpException);
    });

    it('should throw exception when password is empty', async () => {
      const result = controller.register('abc', '');
      expect(result).rejects.toThrow(HttpException);
    });
  });
});
