import { Module } from '@nestjs/common';
import { CryptoService } from './crypto-service/crypto-service';
import { HashGenerator } from './hash-generator/hash-generator';
import { SaltGenerator } from './salt-generator/salt-generator';

@Module({
  exports: [CryptoService],
  providers: [CryptoService, HashGenerator, SaltGenerator],
})
export class CrpytoModule {}
