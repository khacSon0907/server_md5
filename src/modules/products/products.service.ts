import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrimsaService } from '../primsa/primsa.service';
@Injectable()
export class ProductsService {
  constructor(private primsa: PrimsaService) { }


  async findProduct (id:number) {
    try{
        let findbyId = await this.primsa.products.findUnique({
            where: {
              id
            }
        })
        return {
          data:findbyId
        }
    }
    catch(err){
        return{
          err
        }
    }
  }

  async editProduct(id: number, creaProduct:CreateProductDto,image:string) {
    try {
      let editProduct = await this.primsa.products.update({
        where: {
          id,
        },
        data: {
          ...creaProduct,
          avatar:image
        }
      })
      return {
        data:editProduct
      }
    }
    catch (err) {
      return {
        err
      }
    }

  }

  async deleteProduct(id: number) {
    try {
      let deleteCategory = await this.primsa.products.delete({
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

  async getAll() {
    try {
      let findAll = await this.primsa.products.findMany();

      return {
        data: findAll
      }
    }
    catch (err) {
      return {
        message: err
      }
    }
  }

  async create(createProductDto: CreateProductDto, image: string) {
    try {
      let creaProduct = await this.primsa.products.create({
        data: {
          ...createProductDto,
          avatar: image
        }
      })
      return {
        data: creaProduct
      }
    }
    catch (err) {
      return {
        err
      }

    }
  }


}
