import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import { AuthenService } from './authen.service';
import { CreateAuthenDto } from './dto/create-authen.dto';
import { Response } from 'express';
import { SendMailService,template } from '../send-mail/send-mail.service';
import { until } from '../until';
@Controller('authen')
export class AuthenController {
  constructor(private readonly authenService: AuthenService , private sendMailService:SendMailService) {}

  @Post('register')
  async register(@Body() createAuthenDto: CreateAuthenDto,@Res() res:Response){
    try {
      let newUser = await this.authenService.register(createAuthenDto);
      if (!newUser.data) {
        if (newUser.err.meta.target == 'users_username_key') {
          throw ("user name da ton tai")
        }
        if (newUser.err.meta.target == 'users_email_key') {
          throw ("email da ton tai")
        }
      }

      let token = until.token.createToken(newUser.data,String(5 * 60 * 1000));
      
      this.sendMailService.sendMail(newUser.data.email,"Gửi Email Xác Nhận",template.emailConfrim( newUser.data.username,`${process.env.SV_HOST}/authen/email-confirm/${token}`))
      
      return res.status(200).json({
        message: 'ok !',
        data: newUser.data
      })
    }
    catch (err) {
      return res.status(404).json({
        message: err  
      })

    }
  }

  @Get('email-confirm/:token')

  async emailConfirm(@Param('token') token: string, @Res() res: Response) {
     try{
      let tokenData = until.token.decodeToken(token);
      console.log("tokenData", tokenData);
      if(!tokenData){
        throw "Token in Valid"
      }
     
      let user = await this.authenService.updateUser(tokenData.email)
      if(user.err){
        throw " khong tim thay user"
      }
      return res.status(200).send("Email Confirm ok!")
     }
     catch(err){
      console.log("err",err);

      return res.status(500).json({
        
        message: err
      })
     }
  }


}
