import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import { AuthenService } from './authen.service';
import { CreateAuthenDto } from './dto/create-authen.dto';
import { UpdateAuthenDto } from './dto/update-authen.dto';
import { Response } from 'express';
@Controller('authen')
export class AuthenController {
  constructor(private readonly authenService: AuthenService) {}

  @Post('register')
  async register(@Body() createAuthenDto: CreateAuthenDto,@Res() res:Response){
    try{
      let newUser = await this.authenService.register(createAuthenDto);
      return res.status(200).json({
        message:"Sign Up Success",
        data:newUser.data
      })
    } 
    catch(err){
      return res.status(409).json({
        message:err
      })
    }
  }


}
