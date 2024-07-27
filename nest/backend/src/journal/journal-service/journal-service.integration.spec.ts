import { Test, TestingModule } from '@nestjs/testing';
import { JournalService } from './journal-service';
import { User } from '../../entities/user/user';
import { Repository } from 'typeorm';
import { JournalEntry } from '../../entities/journal-entry/journal-entry';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Bmientry } from '../../entities/bmientry/bmientry';

describe('JournalService (unit tests)', () => {
  let provider: JournalService;
  let repo: Repository<JournalEntry>;
  const password = 'ajskfnU7';
  const username = 'marin';
  const title = 'My first entry';
  const description = 'Today was boring...';
  const user: User = {
    bmiEntries: [],
    isAdmin: 0,
    journalEntries: [],
    password: password,
    username: username,
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: './database/test.sqlite',
          synchronize: true,
          autoLoadEntities: true,
          entities: [JournalEntry, User, Bmientry],
        }),
        TypeOrmModule.forFeature([JournalEntry, User, Bmientry]),
      ],
      providers: [JournalService],
    }).compile();

    provider = module.get<JournalService>(JournalService);
    repo = module.get<Repository<JournalEntry>>(
      getRepositoryToken(JournalEntry),
    );
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });

  describe('createJournalEntry', () => {
    it('should create journal entry with parameters', async () => {
      const currentDate = new Date();
      const result = await provider.createJournalEntry(
        user,
        title,
        description,
      );
      expect(result).not.toBeNull();
      expect(result.description).toEqual(description);
      expect(result.title).toEqual(title);
      expect(result.username).toEqual(username);
      expect(result.dateAdded.getDay()).toEqual(currentDate.getDay());
      expect(result.dateAdded.getFullYear()).toEqual(currentDate.getFullYear());
      expect(result.dateAdded.getMonth()).toEqual(currentDate.getMonth());
    });
  });
});
