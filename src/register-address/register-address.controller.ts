import { Controller, Get, Post, Body, Patch, Param, Delete , Req ,Res } from '@nestjs/common';
import { RegisterAddressService } from './register-address.service';
import { CreateRegisterAddressDto } from './dto/create-register-address.dto';
import { UpdateRegisterAddressDto } from './dto/update-register-address.dto';
import {Request} from 'express'

 
// const f:any =async ()=>{
//   // console.log('hello test')
//   const r = await fetch('http://localhost:8001/getAddresses' , {
//     method : "GET",
//     headers: {
//       Accept: "*/*",
//       "Content-Type": "application/json"
//   }}
// )

//   const response =await r.json()
//   console.log(response.status.data)
// }

// setInterval(f , 10000)



@Controller('registerAddress')
export class RegisterAddressController {
  constructor(private readonly registerAddressService: RegisterAddressService) {}

  @Post('registerYourSelf')
  create(@Req() req , @Res() res) {
    return this.registerAddressService.register(req , res);
  }

  @Get('checkService')
  findAll(@Req() req , @Res() res) {
    return this.registerAddressService.check(req , res);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.registerAddressService.findOne(+id);
  // }

  @Patch('updateAddress')
  update( @Body() body:Request , @Req() req , @Res() res) {
    return this.registerAddressService.updateAddress( req , res , body);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.registerAddressService.remove(+id);
  // }
}
