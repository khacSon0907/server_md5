import { Injectable } from '@nestjs/common';
import { CreateAuthenDto } from './dto/create-authen.dto';
import { UpdateAuthenDto } from './dto/update-authen.dto';
import { PrimsaService } from '../primsa/primsa.service';

@Injectable()
export class AuthenService {
  constructor(private primsa: PrimsaService){}

  async register(createAuthenDto : CreateAuthenDto){
    try{

      let newUser = await this.primsa.users.create({
        data:{
          ...createAuthenDto,
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

  create(createAuthenDto: CreateAuthenDto) {
    return 'This action adds a new authen';
  }

  findAll() {
    return `This action returns all authen`;
  }

  findOne(id: number) {
    return `This action returns a #${id} authen`;
  }

  update(id: number, updateAuthenDto: UpdateAuthenDto) {
    return `This action updates a #${id} authen`;
  }

  remove(id: number) {
    return `This action removes a #${id} authen`;
  }
}
