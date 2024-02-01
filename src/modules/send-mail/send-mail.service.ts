import { Injectable } from "@nestjs/common";
import { Transporter, createTransport } from 'nodemailer';
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { SendMailFn,MailOption } from "./interface/mail.interface";
import * as Mailgen from 'mailgen';

@Injectable()
export class SendMailService {

 private transporter: Transporter<SMTPTransport.SentMessageInfo> = createTransport({
        service: 'gmail',
        auth: {
            user: process.env.MAIL_ID,
            pass: process.env.MAIL_PASSWORD
        }
    });

    sendMail: SendMailFn = async (to: string, subject: string, html: string, from: string = process.env.MAIL_ID): Promise<boolean> => {
        try {
            let option: MailOption = {
                from,
                to,
                subject,
                html
            }
            await this.transporter.sendMail(option);
            return true
        } catch (err: any) {
            return false
        }
    }   
}

export const template = {
    emailConfrim: ( ):string => {
        var mailGenerator = new Mailgen({
            theme: 'default',
            product: {
                name: 'Thuốc Lá Thơm',
                link: 'http://localhost:5173'
            }
        });

        var email = {
            body: {
                name: "person",
                intro: 'Welcome to Thuốc Lá Thơm! chúng tôi rất vui vì bạn đã tham gia cộng đồng Thuốc Lá Thơm.',
                action: {
                    instructions: 'Để có thể truy cập vào các tính năng nâng cao, bạn vui lòng bấm vào liên kết bên dưới để xác thực.',
                    button: {
                        color: '#22BC66',
                        text: 'Confirm your email',
                        link:"kkk"
                    }
                },
                outro: 'Nếu bạn gặp bất kỳ khó khăn nào, hãy trả lời email này chúng tôi sẽ giúp bạn!',
                signature: "Trân trọng"
            }
        };

        var emailString = mailGenerator.generate(email);
        return emailString
    }
}
