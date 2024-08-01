import { Test, TestingModule } from '@nestjs/testing';
import { RegisterAddressController } from './register-address.controller';
import { RegisterAddressService } from './register-address.service';

describe('RegisterAddressController', () => {
  let controller: RegisterAddressController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RegisterAddressController],
      providers: [RegisterAddressService],
    }).compile();

    controller = module.get<RegisterAddressController>(RegisterAddressController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
