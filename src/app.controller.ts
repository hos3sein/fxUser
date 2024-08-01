import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AppService } from './app.service';
import { RabbitMQModule ,  AmqpConnection} from '@golevelup/nestjs-rabbitmq';
// import {  Post, Body, Patch, Param, Delete } from '@nestjs/common';
interface CustomModel {        // interface for specificly form of the message
  foo: string;
  bar: string;
}



@Controller()
export class AppController {
  constructor(private readonly messagingService : AppService) {

    // // amqpConnection.publish<CustomModel>('exchange1', 'subscribe-route', {foo :'hossen' , bar : 'khodakhah'});
    // amqpConnection.publish<CustomModel>('exchange1', 'rpc-ro', {foo :'hossen' , bar : 'khodakhah22222'});     // send the message to the consumer
    // ////////////////////////////!
    // //! its uncleared!!!
    // ////////////////////////////!
    // // export class AppController {
    // //   public publish<T = any>(
    // //     exchange: string,   
    // //     routingKey: string,
    // //     message: T,
    // //     options?: amqplib.Options.Publish
    // //   )
    // amqpConnection.publish('exchange1', 'rpc-route', { msg: 'hello world' });          // this is for public publish in chhannell
  }
  
  @Get()
  getHello(){
    return this.messagingService.getHello();
  }

}
