import { Get, Post, Body, Patch, Param, Delete, Controller, Put , Res , Req, UseInterceptors, UploadedFile  } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {Request} from 'express'
import {auth} from '../middleware/middleware.middleware'
import { FileInterceptor, MulterModule } from '@nestjs/platform-express';
import{Express}from 'express'
// MulterModule

@Controller('user')
export class UserController {

 
  constructor(private readonly userService: UserService) {}

  // @Get('email')
  // email(){
  //   return this.userService.email()
  // }


  @Post('register')
  create(@Body() request : Request ,@Req() req ,  @Res() res ) {
    return this.userService.createUser(request , req , res);
  }


  @Post('login')
  login(@Body() body : Request , @Req() req ,  @Res() res ){
    return this.userService.loginUser(body , req , res)
  }


  @Post('newToken')
  refreshToekn(@Body() body : Request , @Req() req ,  @Res() res){
    return this.userService.newToken(req , res , body)
  }


  // @Post('becomeLeader')
  // @UseInterceptors(FileInterceptor('file'))
  // leaderRequset(@UploadedFile() file: Express.Multer.File , @Req() req , @Res() res){
  //   return this.userService.leaderRequest()
  // }


  @Put('checkCode/:code/:email')
  checkCode(@Param('code') code: string , @Param('email') email : string , @Body() request : Request ,@Req() req , @Res() res) {
    // console.log(this.userService.checkCode( code , email , request , res))
    return this.userService.checkCode( code , email , request ,req, res)
  }

  @Patch('update')
  update(@Body() request : Request , @Req() req  , @Res() res) {
    return this.userService.updateUser( request , req , res);
  }

  @Get('forgetPassword')
  resetToken(@Req() req  , @Res() res){
    return this.userService.getResetToken(req , res)
  }


  @Put('resetPassword/:resetToken')
  resetPassword(@Param('resetToken') resetToken: string,@Body() request : Request , @Req() req  , @Res() res){
    return this.userService.resetPasswordWithToken( resetToken,request , req , res)
  }


  // @Put('putNewFollowing')
  // follow(){
  //   return this.userService.
  // }


  @Put('Follow/:userId')
  followed(@Req() req , @Res() res , @Param('userId') userId : string){
    return this.userService.folowSomone(req , res , userId)
  }

  @Put('Subscribe/:userId')
  subscribed(@Req() req , @Res() res , @Param('userId') userId : string){
    return this.userService.subscribe(req , res , userId)
  }


  @Put('NewSeenSignal/:signalId')
  seenSignal(@Req() req , @Res() res , @Param('signalId') signalId : string){
    return this.userService.seenSignal(req , res , signalId)
  }

  @Put('autoExpand')
  setAutoExpand(@Req() req , @Res() res ){
    return this.userService.setAutoExpand(req , res )
  }

  @Put('setDiscount')
  setDiscount(@Req() req , @Res() res , @Body() body : Request){
    return this.userService.discount(req , res  , body)
  }


  @Put('setSubscribtionFee/:fee')
  setLeaderFee(@Req() req , @Res() res , @Param('fee') fee : string){
    return this.userService.subScribeFee(req , res , +fee)
  }

  
  @Patch('updateLevel')
  updateLevel(){
    //! when level update???
  }

  @Put('deActiveUser')
  Activation(){
    
  }

  @Put('approveSubScribe/:Id')
  approveSubScribe(@Param('Id') Id : string , @Req() req , @Res() res){
    return this.userService.approveSubScribtion(req , res , Id)
  }

  // @Put('approveSubScribe/:Id')
  // approveLeader(@Param('Id') Id : string , @Req() req , @Res() res){
  //   return this.userService.approveLeader(req , res , Id)
  // }


  @Get('allPendingSubScriber')
    getPending(@Req() req , @Res() res){
      return this.userService.pendingSubScribers(req , res)
    }
  
  
  // @Get('test')
  // testing(@Req() req  , @Res() res){
  //   // console.log('headers',req.headers)
  //   // return res.status(200).json({
  //   //   success : true
  //   // })
  //   return this.userService.testing(req , res)
  // }

}



