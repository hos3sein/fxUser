import { Injectable } from '@nestjs/common';
import { CreateMessagingDto } from './dto/create-messaging.dto';
import { UpdateMessagingDto } from './dto/update-messaging.dto';
import { RabbitMQModule ,  AmqpConnection} from '@golevelup/nestjs-rabbitmq';
import { RabbitRPC , RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { HttpException, HttpStatus , Logger } from '@nestjs/common';
import amqp, { ChannelWrapper } from 'amqp-connection-manager';
import { Channel } from 'amqplib';
import { ConfirmChannel } from 'amqplib';
import { userInterFace } from 'src/user/entities/user.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

interface CustomModel {        // interface for specificly form of the message
  foo: string;
  bar: string;
}   


@Injectable()
export class MessagingService {
  // constructor(private readonly amqpConnection: AmqpConnection) {}            // get amqpConnection in constructor
  private channelWrapper: ChannelWrapper;         // make the channel wrapper
  constructor(@InjectModel('user') private userModel : Model<userInterFace>) {                                         
    const connection = amqp.connect(['amqp://localhost']);     // connect to rabbit
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////!
    //*its for assert the queues
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////!
    this.channelWrapper = connection.createChannel({             // crathe the channel
      setup: (channel: Channel) => {                                    // setup the channel
        channel.assertQueue('emailQueue', { durable: true });          // assert the queue
        channel.assertQueue('transAction', { durable: true }); 
        channel.assertQueue('getUserData', { durable: true });          // assert the queue for get  User data
        channel.assertQueue('responseForGetUserData', { durable: true });          // assert the queue for response the get user
        channel.assertQueue('createWallet', { durable: true });          // assert the queue for response the get user
        channel.assertQueue('responseForCreateWallet', { durable: true });          // assert the queue for response the get user
      },
    });  


    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////!
    //*its for when the other services want user data
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////!

    this.channelWrapper.addSetup(async (channel : ConfirmChannel) => {          // add setup for channel
      // await channel.assertQueue('signal', { durable: true });                    // assert the queu
      await channel.consume('getUserData', async (message) => {   
        const userId = JSON.parse(message.content.toString())
        // console.log(userId)
        channel.ack(message);
        const userData = await this.userModel.findById(userId)
        console.log('recieved user data')
        await this.channelWrapper.sendToQueue(
          'responseForGetUserData',
          Buffer.from(JSON.stringify({userData : userData})),
        );   

    })})
  }




   ////////////////////////////////////////////////////////////////////////////////////////////////////////////////!
    //*its for 
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////!
  async addToEmailQueue(mail: any) {                  // send the message in queue
    try {
      await this.channelWrapper.sendToQueue(
        'emailQueue',
        Buffer.from(JSON.stringify(mail)),
      );   
      Logger.log('Sent To Queue');
    } catch (error) {
      throw new HttpException(
        'Error adding mail to queue',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

   ////////////////////////////////////////////////////////////////////////////////////////////////////////////////!
    //*its for send message to wallet for creating wallet
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////!

    async createWallet(user: any) {                  // send the message in queue
      try {
        await this.channelWrapper.sendToQueue(
          'createWallet',
          Buffer.from(JSON.stringify(user)),
        );   
        Logger.log('create wallet sent to wallet service');
      } catch (error) {
        throw new HttpException(
          'Error adding mail to queue',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }

   ////////////////////////////////////////////////////////////////////////////////////////////////////////////////!
    //*its for send message to wallet for make transAction
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////!

    async payToLeader(users  , type : number) {                  // send the message in queue
      const data = {user1 : users.payer , user2 : users.reciever , type : type , amount : users.amount}
      console.log(users.amount)
      try {
        await this.channelWrapper.sendToQueue(
          'transAction',
          Buffer.from(JSON.stringify(data)),
        );   
        Logger.log('transAction to wallet sent to wallet service');
      } catch (error) {
        throw new HttpException(
          'Error adding mail to queue',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }








  ////////////////////////////////////////////////////////!
  //! the other algorithmmmmmmmmmmmm
  ////////////////////////////////////////////////////////!
  // message reciever 


  // @RabbitSubscribe({           // uncleared!!!   
  //     exchange: 'exchange1',     // the exchange name
  //     routingKey: 'w-f-r',   //routing key
  //     queue: 'subscribe-queue',       // the queue
  //   })
  //   public async pubSubHandler(msg: {}) {         // then handle the message
  //     console.log(`Received message: ${JSON.stringify(msg)}`);
  //   }
  



  // sendMessage(){              // function send message for sending message
  //   // amqpConnection.publish<CustomModel>('exchange1', 'subscribe-route', {foo :'hossen' , bar : 'khodakhah'});
  //   this.amqpConnection.publish<CustomModel>('exchange1', 'rpc-route', {foo :'hossen' , bar : 'khodakhah22222'});     // send the message to the consumer
  //   ////////////////////////////!
  //   //! its uncleared!!!    
  //   ////////////////////////////!
  //   // export class AppController {
  //   //   public publish<T = any>(   
  //   //     exchange: string,           
  //   //     routingKey: string, 
  //   //     message: T,
  //   //     options?: amqplib.Options.Publish    
  //   //   )
  //   this.amqpConnection.publish('exchange1', 'rpc-route', { msg: 'hello world' });          // this is for public publish in chhannell
  // }   
  



  // ////////////////////////////////////////////////////////////////////!
  // create(createMessagingDto: CreateMessagingDto) {   
  //   return 'This action adds a new messaging';
  // }

  // findAll() {
  //   return `This action returns all messaging`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} messaging`;
  // }

  // update(id: number, updateMessagingDto: UpdateMessagingDto) {
  //   return `This action updates a #${id} messaging`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} messaging`;
  // }
}
