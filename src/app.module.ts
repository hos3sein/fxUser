import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { MessagingModule } from './messaging/messaging.module';
import { MessagingController } from './messaging/messaging.controller';
import { MessagingService } from './messaging/messaging.service';
import { MongooseModule } from "@nestjs/mongoose";
import { UserModule } from './user/user.module';
import {UserSchema} from "./user/entities/user.entity"
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { RegisterAddressModule } from './register-address/register-address.module';
import {ConfigService , ConfigModule} from '@nestjs/config'
import { TokenService } from './token/token.service';
import { EmailService } from './email/email.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { MulterModule } from '@nestjs/platform-express';


// ConfigService.rootPath = path.resolve(__dirname, '..');

@Module({
  imports: [ MulterModule.register({ dest: './uploads' }) , MailerModule.forRoot({
    transport: {
      host: 'smtp.gmail.com',
      port : 465,
      secure : true,
      auth: {
        user: 'kianlucifer0098@gmail.com',
        pass: 'cnno pezo wooi qkpl',
      },
    },
  })
    ,ConfigModule.forRoot({envFilePath: 'config.env',isGlobal : true}) , MongooseModule.forRoot(process.env.MONGO_CONNECTION_STRING),
    MongooseModule.forFeature([{ name: 'user', schema: UserSchema }]),
    MessagingModule,
    UserModule,
    RegisterAddressModule,
  ],
  controllers: [AppController , MessagingController , UserController],
  providers: [AppService , MessagingService , MessagingController , UserController , UserService, TokenService, EmailService],
})
export class AppModule {}
