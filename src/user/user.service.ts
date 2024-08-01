import { Injectable, NotFoundException , Res  } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { userInterFace } from './entities/user.entity';
import { Model } from "mongoose";
import { UpdateUserDto } from './dto/update-user.dto';
import {Request} from 'express'
const jwt = require('jsonwebtoken')
import { HttpException, HttpStatus , Logger } from '@nestjs/common';
import amqp, { ChannelWrapper } from 'amqp-connection-manager';
import { Channel } from 'amqplib';
const crypto = require('crypto')
import { RabbitMQModule ,  AmqpConnection} from '@golevelup/nestjs-rabbitmq';
import { setInterval } from 'timers/promises';
import { Respons } from 'src/response/response';
import { MessagingService } from 'src/messaging/messaging.service';
import { TokenService } from 'src/token/token.service';
import { EmailService } from 'src/email/email.service';
import { Subscriber } from 'rxjs';
// import { Cron } from '@nestjs/schedule';   



@Injectable()

export class UserService {

constructor( private readonly emailService : EmailService , private readonly tokenService : TokenService , private readonly messaginService : MessagingService,@InjectModel('user') private userModel : Model<userInterFace>) {}



  async email(){
    return this.emailService.sendEmail(1010 , 'hosseinlu0098@gmail.com')
    
  } 


async createUser(request : Request ,req , res){         // for create the new user
   const exisiting = await this.userModel.findOne({email : request['email']})
   if (exisiting){
    return new Respons(req , res , 401 , 'this user already exist!!!' , 'this user existent!!' , null)
   }
   const Code = Math.round((Math.random()*10000)) 
   let code : number;
   const hashedPassword = await this.tokenService.passwordHasher(request['password'])
   request['code'] = Code  
   request['role'] = 0
   request['usingCode'] = false;
   request['password'] = hashedPassword;
   await this.emailService.sendEmail( Code , request['email'])               // for sending email for validating the emmail address
   const newStudent = new this.userModel(request);     
   newStudent.save().then((resault)=>{
    // this.createUserToSql(`create user` , resault)                 // save in sql db
    return new Respons(req , res , 200 , 'code sent to user' , null , Code)
   })  
}



async loginUser(body : Request , req , res){
  // console.log(body)
  this.userModel.findOne({email : body['email']}).then(async(resault)=>{
    if (!resault){
      return new Respons(req , res , 404 , 'loging in user' , 'this user is not exist in the database' , null)
    }
    const hashedPassword = await this.tokenService.passwordHasher(body['password'])
    
    if (hashedPassword != resault.password){
      return new Respons(req , res , 401 , 'loging in user' , 'the password is incorrect!!!' , null)
    }

    const userData = {
      _id : resault._id,
      username : resault.username,
      role : resault.role,
      suspend : resault.suspend,
      email : resault.email
    }

    const token = await this.tokenService.tokenize(userData)
    const refreshToken = await this.tokenService.refreshToken(resault.email)

    await this.userModel.findByIdAndUpdate(resault._id , {refreshToken : refreshToken})

    return new Respons(req , res , 200 , 'loging in user' , null , {token : token , refreshToken : refreshToken , user : resault})

  })
}



async newToken(req , res , body){
  // console.log(body)
  const token = body.refreshToken;
  if (!token){
   return new Respons(req , res , 401 , 'get new token!!' , 'please send refresh token' , null)
  }
  

  try {
    const decoded = jwt.verify(token, process.env.REFRESH_SECRET_KEY )
    // console.log(decoded)
    if (!decoded){
      return new Respons(req , res , 401 , 'get new token!!' , 'login again!!!' , null)
    }
    const user = await this.userModel.findOne({email : decoded.userData})

  if (!user){
    return new Respons(req , res , 401 , 'get new token!!' , ' please login again' , null)
  }

  const userData = {
    _id : user._id,
    username : user.username,
    role : user.role,
    suspend : user.suspend,
    email : user.email,
    wallet : user.wallet,
    region : user.region,
    profile : user.profile,
    level : user.level
  }
  const Token = await this.tokenService.tokenize(userData)
  const refreshToken = await this.tokenService.refreshToken(user.email)
  await this.userModel.findOneAndUpdate({email : decoded.email} , {refreshToken : refreshToken})
  return new Respons(req , res , 200 , 'get new token by refresh token!!!' , null , {token : Token , refreshToken : refreshToken  , user : userData})
  
  } catch (error) {
    console.log(error)
  }
}   



async updateUser(request : Request , req , res) {     // for update the user
  const userId = req.user._id;
  const existingUser = await this.userModel.findByIdAndUpdate(userId , request , { new: true });
   if (!existingUser) {

    return new Respons(req , res , 404 , 'this user is not found!!!!!' , 'this user is not exists!!' , null)
   
  }else{
    const userData = {
      _id : existingUser._id,
      username : existingUser.username,
      role : existingUser.role,
      suspend : existingUser.suspend,
      email : existingUser.email
    }
    const token = this.tokenService.tokenize(userData)
    const refreshToken = this.tokenService.refreshToken(existingUser.email)
    // this.createUserToSql('update user' , existingUser)
    
    const wallet = await this.messaginService.createWallet({userName : existingUser['username'] ,         // send message to wallet for creating the user wallet
      email : existingUser['email'],
      role : existingUser['role'],
      profile : existingUser['profile'],
      suspend : existingUser['suspend'],})      

      await this.userModel.findByIdAndUpdate(userId , {Vwallet : wallet , role : 1} , { new: true });
      return new Respons(req , res , 200 , 'updating user success!!!' , null , {token : token , refreshToken : refreshToken , user : existingUser})
   }
 } 



async checkCode(code : string , email : string , request : Request , req , res){
  const existinguser = await this.userModel.findOne({email : email})
  if  (!existinguser){
    
    return new Respons(req , res , 404 , 'this user is not found!!!!!' , 'this user is not exists!!' , null)

  }else if(existinguser.code != parseInt(code)){
    return new Respons(req , res , 404 , 'this code is not correct!!' , 'incorrect code' , null)
    
  }else{
    this.userModel.findOneAndUpdate({email : email} , {
      usingCode : true,
    }).then(async(resault)=>{
      
      const userData = await this.userModel.findOne({email : email})
      const token = await this.tokenService.tokenize(userData)
      const refreshToken =await this.tokenService.refreshToken(userData.email)
      
      return new Respons(req , res , 200 , 'user register' , null , {token : token , refreshToken : refreshToken})
      
    })
  }
}



async getResetToken(req , res){
  const user = this.userModel.findById(req.user._id)
  if (!user){

    return new Respons(req , res , 404 , 'getting reset token' , 'this user is not exist on database!!!' ,null)
    
  }
  const resetToken = await this.tokenService.passwordHasher(req.user.email)
  this.userModel.findByIdAndUpdate(req.user._id , {resetPasswordToken : resetToken , resetTokenExpire : ((new Date()).getSeconds()+(24*3600))})
  .then((resault)=>{
    if (!resault){

      return new Respons(req , res , 404 , 'getting reset token' , 'reset password failed!! try again!!!' ,null)

    }

    return new Respons(req , res , 200 , 'reset password token sendt to user email!!!' , 'reset password failed!! try again!!!' , {resetToken : resetToken})

  }).catch((err)=>{

    return new Respons(req , res , 404 , 'connecting to database on geting reset password failed!!' , `${err}` , null)

  })
}



async resetPasswordWithToken(resetToken, request : Request , req , res){
  const checkResetCode = await this.userModel.findById(req.user._id)
    if (request['newPassword'] != request['confirmPassword']){

      return new Respons(req , res , 404 , 'reset password with reset token!!' , `the confirm password is incorrect!!` , null)

    }
    if (!checkResetCode){

      return new Respons(req , res , 404 , 'reset password with reset token!!' , 'this user is not exist on database!!!' , null)

    }
    if (checkResetCode['resetPasswordToken'] != resetToken || (parseInt(checkResetCode['resetTokenExpire']) - (new Date().getSeconds())) <= 0 ){
      
      return new Respons(req , res , 404 , 'reset password with reset token!!' , 'the reset token expired!!!!try again!!!' , null)

    }
    await this.userModel.findByIdAndUpdate(req.user._id , {password : this.tokenService.passwordHasher(request['newPassword']) , resetPasswordToken : null , resetTokenExpire : null })
    .then((resault)=>{

      return new Respons(req , res , 200 , 'reset password with reset token!! successfull' , null , null)

      return res.status(200).json({
        success : true,
        status:{
          message : 'the password change successfully!!!',
        }
      })
    }).catch((err)=>{

      return new Respons(req , res , 404 , 'errore occured in connecting to database in service user in resetPassword!!!' , `${err}` , null)

    })
}

async folowSomone(req , res , userId){
  const user1 = await this.userModel.findById(req.user._id)
  const user2 = await this.userModel.findById(userId)

  if (!user2){

    return new Respons(req , res , 404 , 'follow someone' , 'this user has no exist!' , null)

  }
  if (user2.role < 3){

    return new Respons(req , res , 404 , 'follow someone' , 'this leader cant followed before geting approve!!' , null)

  }

  const follower = await this.userModel.findByIdAndUpdate(req.user._id , {
    $addToSet : {followings : userId}
  })

  const following = await this.userModel.findByIdAndUpdate(userId , {
    $addToSet : {followers : req.user._id}
  })

  return new Respons(req , res , 200 , 'follow someone' , null , {follower : follower , following : following})

} 


async subscribe(req , res , userId){
  const user1 = await this.userModel.findById(req.user._id)
  const user2 = await this.userModel.findById(userId)

  if (!user2){

    return new Respons(req , res , 404 , 'subscribe someone' , 'this user has no exist!' , null)

  }
  if (user2.role < 3){

    return new Respons(req , res , 401 , 'subscribe someone' , 'this leader cant subscribed before getting approve!!' , null)

  }
 
  
  this.messaginService.payToLeader( {
    payer : user1,
    reciever : user2,
    amount : user2.subScriberFee
  } , 0)

  const subscriber = await this.userModel.findByIdAndUpdate(req.user._id , {
    $addToSet : {subScribing : userId}
  })

  const subscibing = await this.userModel.findByIdAndUpdate(userId , {
    $addToSet : {subScriber : {userId : req.user._id , createTime : new Date() , status : 0}}
  })


  return new Respons(req , res , 200 , 'subscribe someone' , null , {subscriber : subscriber , subscibing : subscibing})

}



async seenSignal(req , res , signalId){
  const userId = req.user._id
  this.userModel.findByIdAndUpdate(userId , {
      $addToSet : {seenSignals : signalId}
  }).then((resault)=>{

    return new Respons(req , res , 200 , 'seen Signal' , null , resault)
    
  }).catch((err)=>{

    return new Respons(req , res , 404 , 'seen Signal' , `putthing new seen signal in data base failed : ${err}` , null)

  })
}


  async setAutoExpand(req , res){
    const user = await this.userModel.findById(req.user._id)
    this.userModel.findByIdAndUpdate(req.user._id , {
      autoExpand : user.autoExpand ? false : true
    }).then((resault)=>{

      return new Respons(req , res , 200 , 'set Auto Expand!' ,  null , resault)

    }).catch((err)=>{

      return new Respons(req , res , 404 , 'set Auto Expand!' ,  `setting autoExpand failed in connecting to database!! : ${err}` , null)

    })
  }


  async discount(req , res , body){
    const user =await this.userModel.findById(req.user._id)

    if (user.role<3){
      return res.status(401).json({
        success : false,
        status:{
          message : 'forbbiden user!! ',
          error : 'this leader cant set discount befor geting approved!!'
        }
      })
    }


    body['active'] = true

    this.userModel.findByIdAndUpdate(req.user._id , {
      $addToSet : {discount : body}
    }).then((resault)=>{
      return res.status(200).json({
        success : true , 
        status:{
          message : 'seting discount successfull!!',
          data : resault
        }
      })
    }).catch((err)=>{
      return res.status(404).json({
        success : true,
        status:{
          message : 'setting discount failed in connecting to database!!',
          error : `${err}`
        }
      })
    })


  }


  async subScribeFee(req , res , fee : number){
    this.userModel.findByIdAndUpdate(req.user._id , {
      subScriberFeee : fee
    }).then((resault)=>{
      if (!resault){
        return new Respons(req , res , 404 , 'set SubScribeFee' ,  `setting subScriber Fee failed  : the leader not exist` , null)
      }

      return new Respons(req , res , 200 , 'set SubScribeFee' ,  null , resault)

    }).catch((err)=>{

      return new Respons(req , res , 404 , 'set SubScribeFee' ,  `setting subScriber Fee failed in connecting to database!! : ${err}` , null)

    })
  }


  async pendingSubScribers(req , res){
    // console.log(req.user.username)
    this.userModel.findOne({
      _id : req.user._id
    }).then((resault)=>{
      return new Respons(req , res , 200 , 'get all pending subscribers' , null , resault.subScriber)
    }).catch((err)=>{
      return new Respons(req , res , 404 , 'get all pending subscribers' , `connecting to database failed : ${err}` , null)
    })
  }



  
  async approveSubScribtion(req , res , Id){
    // {$and : [ {_id : req.user._id} , {"sunScriber.userId" :  Id}]} ,  {$set : {"subScriber.$.status" : 1}}
    this.userModel.findOneAndUpdate( {_id : req.user._id , "subScriber.userId" :  Id} , {$set : {'subScriber.$.status' : 1}}).then((resault)=>{
      return new Respons(req , res , 200 , 'approve pending subscribers' , null , resault)
    }).catch((err)=>{
      return new Respons(req , res , 404 , 'approve pending subscribers' , `${err}` , null)
    })
   
  }
}