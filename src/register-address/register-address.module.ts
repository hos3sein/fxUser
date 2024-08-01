import { Module } from '@nestjs/common';
import { RegisterAddressService } from './register-address.service';
import { RegisterAddressController } from './register-address.controller';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [CacheModule.register()],
  controllers: [RegisterAddressController],
  providers: [RegisterAddressService],
})
export class RegisterAddressModule {}
