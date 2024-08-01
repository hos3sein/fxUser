import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';


@Injectable()
export class EmailService {

    constructor(private readonly mailService : MailerService){}


    async sendEmail(code ,sendTo : string){

    const message = `your code is ${code}`;

       const r = await this.mailService.sendMail({  
            from: 'FxLeader',
            to: sendTo,
            subject: `authontication Code!!`,
            text: message,
        })
        console.log(r)
        return r
    }
}
