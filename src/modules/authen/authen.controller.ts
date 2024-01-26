import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import { AuthenService } from './authen.service';
import { CreateAuthenDto } from './dto/create-authen.dto';
import { UpdateAuthenDto } from './dto/update-authen.dto';
import { Response } from 'express';
@Controller('authen')
export class AuthenController {
  constructor(private readonly authenService: AuthenService) {}

  @Post()
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

  @Get()
  findAll() {
    return this.authenService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authenService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthenDto: UpdateAuthenDto) {
    return this.authenService.update(+id, updateAuthenDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authenService.remove(+id);
  }
}
