import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import { AuthenService } from './authen.service';
import { CreateAuthenDto } from './dto/create-authen.dto';
import { Response } from 'express';
@Controller('authen')
export class AuthenController {
  constructor(private readonly authenService: AuthenService) {}

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
