import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import { AuthenService } from './authen.service';
import { CreateAuthenDto } from './dto/create-authen.dto';
import { Response } from 'express';
import { SendMailService } from '../send-mail/send-mail.service';
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

      this.sendMailService.sendMail(newUser.data.email,"Gửi Email Xác Nhận","đã nhận được email vui lòng xác nhận")
      
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

}
