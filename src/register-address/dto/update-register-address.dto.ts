import { PartialType } from '@nestjs/mapped-types';
import { CreateRegisterAddressDto } from './create-register-address.dto';

export class UpdateRegisterAddressDto extends PartialType(CreateRegisterAddressDto) {}
