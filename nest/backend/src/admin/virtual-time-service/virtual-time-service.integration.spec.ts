import { Test, TestingModule } from '@nestjs/testing';
import { VirtualTimeService } from './virtual-time-service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { InternalServerErrorException } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';

describe('VirtualTimeService (integration with env file)', () => {
  let provider: VirtualTimeService;
  let configService: ConfigService;
  const filePath = path.resolve(__dirname, '../../../time.json');

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [VirtualTimeService],
    }).compile();

    provider = module.get<VirtualTimeService>(VirtualTimeService);
  });

  describe('setTime', () => {
    it('should set JSON file variable if positive', async () => {
      const newOffset = 1;
      await provider.setTime(newOffset);

      const data = await fs.readFile(filePath, { encoding: 'utf8' });
      const object = JSON.parse(data);

      expect(object.offset).toBe(newOffset);
    });

    it('should set JSON file variable if negative', async () => {
      const newOffset = -1;
      await provider.setTime(newOffset);

      const data = await fs.readFile(filePath, { encoding: 'utf8' });
      const object = JSON.parse(data);

      expect(object.offset).toBe(newOffset);
    });
    it('should set JSON file variable if 0', async () => {
      const newOffset = 0;
      await provider.setTime(newOffset);

      const data = await fs.readFile(filePath, { encoding: 'utf8' });
      const object = JSON.parse(data);

      expect(object.offset).toBe(newOffset);
    });
  });

  describe('getTime', () => {
    it('should return hour in the future if offset is positive', async () => {
      const offset = 1;
      await provider.setTime(offset);
      const serverTime = await provider.getTime();
      const currentDate = new Date();

      expect(serverTime.getDate()).toEqual(currentDate.getDate());
      expect(serverTime.getMonth()).toEqual(currentDate.getMonth());
      expect(serverTime.getFullYear()).toEqual(currentDate.getFullYear());
      expect(serverTime.getHours()).toEqual(currentDate.getHours() + offset);
    });

    it('should return hour in the past if offset is negative', async () => {
      const offset = -1;
      await provider.setTime(offset);
      const serverTime = await provider.getTime();
      const currentDate = new Date();

      expect(serverTime.getDate()).toEqual(currentDate.getDate());
      expect(serverTime.getMonth()).toEqual(currentDate.getMonth());
      expect(serverTime.getFullYear()).toEqual(currentDate.getFullYear());
      expect(serverTime.getHours()).toEqual(currentDate.getHours() + offset);
    });

    it('should return current time if offset is 0', async () => {
      const offset = 0;
      await provider.setTime(offset);
      const serverTime = await provider.getTime();
      const currentDate = new Date();

      expect(serverTime.getDate()).toEqual(currentDate.getDate());
      expect(serverTime.getMonth()).toEqual(currentDate.getMonth());
      expect(serverTime.getFullYear()).toEqual(currentDate.getFullYear());
      expect(serverTime.getHours()).toEqual(currentDate.getHours());
    });

    it('should return previous day if offset is -24', async () => {
      const offset = -24;
      await provider.setTime(offset);
      const serverTime = await provider.getTime();
      const currentDate = new Date();

      expect(serverTime.getDate()).toEqual(currentDate.getDate() - 1);
      expect(serverTime.getMonth()).toEqual(currentDate.getMonth());
      expect(serverTime.getFullYear()).toEqual(currentDate.getFullYear());
      expect(serverTime.getHours()).toEqual(currentDate.getHours());
    });

    it('should return next day if offset is +24', async () => {
      const offset = 24;
      await provider.setTime(offset);
      const serverTime = await provider.getTime();
      const currentDate = new Date();

      expect(serverTime.getDate()).toEqual(currentDate.getDate() + 1);
      expect(serverTime.getMonth()).toEqual(currentDate.getMonth());
      expect(serverTime.getFullYear()).toEqual(currentDate.getFullYear());
      expect(serverTime.getHours()).toEqual(currentDate.getHours());
    });
  });
});
