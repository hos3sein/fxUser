import { Injectable, NestMiddleware } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Respons } from 'src/response/response';
import { userInterFace } from 'src/user/entities/user.entity';
const jwt = require('jsonwebtoken')



@Injectable()
export class auth implements NestMiddleware {
  constructor(@InjectModel('user') private readonly userModel :Model<userInterFace>){}
  use(req: any, res: any, next: () => void) {
    // console.log(req.headers)
    let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
    ) {
    // Set token from Bearer token in header
    token = req.headers.authorization.split(" ")[1];
  }

  // console.log(token)

  if (!token) {
    if (!req.headers.refreshToken){
      return res.status(401).json(({
        success : false,
        status : {
          message : 'forbidden user!!!'
        }
      }));
    }
    const refresh = jwt.verify(token, process.env.REFRESH_SECRET_KEY )
    if (!refresh){
      return new Respons(req , res , 401 , 'user authorization' , 'please login again!!!' , null)
    }
    this.userModel.findOne({email : refresh.userData}).then((resault)=>{
      const token = jwt.sign({userData : resault} , process.env.SECRET_KEY)
      return new Respons(req , res , 401 , 'user authorization' , 'the new token set successfully!!!' , {token : token , refreshToken : req.headers.refreshToken})
    }).catch((err)=>{
      console.log(err)
    })
  }
  
  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.SECRET_KEY );   

    if (!decoded) {
      return res.status(401).json(({
        success : false,
        status : {
          message : 'forbidden user!!!'
        }
      }));
    }
    req.user = decoded.userData;
    next();
  } catch (err) {
    return res.status(401).json(({
      success : false,
      status : {
        message : 'forbidden user!!!'
      }
    }));
  }
  }
}
