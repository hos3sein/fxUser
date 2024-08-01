import { Module , MiddlewareConsumer , NestModule , RequestMethod} from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from "@nestjs/mongoose";
import{UserSchema} from "./entities/user.entity"
import {auth} from '../middleware/middleware.middleware'
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { MessagingModule } from 'src/messaging/messaging.module';
import { MessagingController } from 'src/messaging/messaging.controller';
import { MessagingService } from 'src/messaging/messaging.service';
import { TokenService } from 'src/token/token.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailService } from 'src/email/email.service';
import { MulterModule } from '@nestjs/platform-express';
// import { ScheduleModule } from '@nestjs/schedule';


@Module({
  imports:[ MulterModule.register({ dest: './uploads' }), MailerModule.forRoot({
    transport: {
      host: 'smtp.gmail.com',
      port : 465,
      secure : true,
      auth: {
        user: 'fxleader46@gmail.com',
        pass: 'Fx@09014010751',
      },
    },
  }), MongooseModule.forRoot(process.env.MONGO_CONNECTION_STRING),
    MongooseModule.forFeature([{ name: 'user', schema: UserSchema }]),
    MessagingModule
  ],
  controllers: [UserController , MessagingController],
  providers: [UserService , MessagingController , MessagingService , TokenService , EmailService],
})


export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(auth).forRoutes({path : 'user/update' , method :  RequestMethod.PATCH} , 
        // {path : 'user/test' , method : RequestMethod.GET},
        {path : 'user/forgetPassword' , method : RequestMethod.GET},
        {path : 'user/resetPassword' , method : RequestMethod.PUT},
        {path : 'user/Subscribe/:userId' , method : RequestMethod.PUT},
        {path : 'user/allPendingSubScriber' , method : RequestMethod.GET},
        {path : 'user/approveSubScribe/:Id' , method : RequestMethod.PUT},
      )
  }
}


