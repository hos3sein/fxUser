import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MessagingService } from './messaging.service';
import { CreateMessagingDto } from './dto/create-messaging.dto';
import { UpdateMessagingDto } from './dto/update-messaging.dto';
import { RabbitMQModule ,  AmqpConnection} from '@golevelup/nestjs-rabbitmq';
import { Request } from 'express';


@Controller()   
export class MessagingController {
  constructor(private readonly messagingService: MessagingService) {
  }


  @Post('register')
  create(@Body() Request : Request) {
    return this.messagingService.addToEmailQueue('hello its for testing!!!!')
  } 

  // @Post('register')
  // // create( @Body() ) {
  //   return this.messagingService.sendMessage();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.messagingService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateMessagingDto: UpdateMessagingDto) {
  //   return this.messagingService.update(+id, updateMessagingDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.messagingService.remove(+id);
  // }
}
