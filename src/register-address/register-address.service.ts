import { Inject, Injectable } from '@nestjs/common';
import { CreateRegisterAddressDto } from './dto/create-register-address.dto';
import { UpdateRegisterAddressDto } from './dto/update-register-address.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
// import { CacheModule  } from '@nestjs/cache-manager';


@Injectable()
export class RegisterAddressService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager : Cache){}

async f (service){
  // console.log('test')
  // console.log('sssss>>' , service)
  const r = await fetch('http://localhost:8001/addNewService' , {
    method : "POST",
    headers: {
      // Accept: "*/*",
      "Content-Type": "application/json",
    },
   body:JSON.stringify({Address : service})
}
)

  const response =await r.json()
  console.log(response.status.data)
  return response
}



  async register(req ,  res) {
    console.log('test')
    const reg = await this.f({
      name : 'userService',
      address : 'http://localhost:4001',
      status : 1
    })

    // return 'This action adds a new registerAddress';
    return res.status(200).json(reg)
  }
  
  async check(req , res){
    return res.status(200).json({
      success : true
    })
  }

  async updateAddress(req , res , body){
    console.log(body)
    // const value = await this.cacheManager.get('key');
    await this.cacheManager.set('address', body);
    // await this.cacheManager.del('key');
    // await this.cacheManager.reset();
  }
}
