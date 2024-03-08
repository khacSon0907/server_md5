import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrimsaService } from '../primsa/primsa.service';

@Injectable()
export class CategoriesService {
  constructor(private primsa: PrimsaService) { }

  async getAll() {
    try {
      let findAll = await this.primsa.categories.findMany();

      return {
        data: findAll
      }
    }
    catch (err) {
      return {
        err
      }
    }
  }
  async editCategory (id:number, updateCate: string){
    try{

      let updateCategory = await this.primsa.categories.update({
        where :{
          id
        },
        data:{
          title:updateCate
        }
      })
      return {
        data: updateCategory
      }
    }
    catch(err){
      return{
        err
      }
    }
  }

  async create(newCate: CreateCategoryDto) {
    try {
      let newCategory = await this.primsa.categories.create({
        data: {
          ...newCate
        }
      })
      return {
        data: newCategory
      }

    }
    catch (err) {
      return {
        err
      }

    }
  }

  async deleteCategories(id: number) {
    try {
      let deleteCategory = await this.primsa.categories.delete({
        where: {
          id
        }
      })

      return {
        data: deleteCategory
      }
    }
    catch (err) {
      return {
        err
      }
    }
  }

}
