import { Injectable } from '@nestjs/common';
import { CreateAuthenDto } from './dto/create-authen.dto';
import { UpdateAuthenDto } from './dto/update-authen.dto';
import { PrimsaService } from '../primsa/primsa.service';
import {hash} from 'bcrypt';
@Injectable()
export class AuthenService {
  constructor(private primsa: PrimsaService){}

  async register(createAuthenDto : CreateAuthenDto){
    try{

      let newUser = await this.primsa.users.create({
        data:{
          ...createAuthenDto,
          password:await hash(createAuthenDto.password,10),
          updateAt:String(Date.now()),
          createAt:String(Date.now())
        }
      }) 
      
      return {
        data:newUser
      }
    }
    catch(err){
      return {
        err
      }
    }

  }


}
