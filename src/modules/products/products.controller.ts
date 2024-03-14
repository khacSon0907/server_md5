import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, Res } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { writeFileSync } from 'fs';
import { Response } from 'express';
import { Product } from './entities/product.entity';
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }
  @Patch('update/:id')
  @UseInterceptors(FileInterceptor('productEdit'))
  async updateProduct(@UploadedFile() file: Express.Multer.File, @Res() res: Response, @Param('id') id: string, @Body() body: any) {
    try {
      if (file) {
        let data: any = JSON.parse(body.data);
        let fileName: string = `img_${Date.now() * Math.random()}.${file.mimetype.split('/')[1]}`
        writeFileSync('public/product/' + fileName, file.buffer)
        let imageProduct: string = `${process.env.SV_HOST}/product/${fileName}`
        let updateProduct = await this.productsService.editProduct(+id, data, imageProduct)
        console.log("update product ", updateProduct.data);

        return res.status(200).json({
          message: "Sửa sản phẩm thành công",
          data: updateProduct.data
        })
      }
      else {
        let findProduct = await this.productsService.findProduct(+id);
        let imageProduct = findProduct.data.avatar;
        let data: any = JSON.parse(body.data);
        let updateProduct = await this.productsService.editProduct(+id, data, imageProduct)
        console.log("update product ", updateProduct.data);
        return res.status(200).json({
          message: "Sửa sản phẩm thành công",
          data: updateProduct.data
        })
      }
    }
    catch (err) {
      return {
        data: err,
      }

    }
  }

  @Delete(':id')
  async deleteProduct(@Res() res: Response, @Param('id') id: string) {
    try {
      let deleteProduct = await this.productsService.deleteProduct(+id);

      console.log("deleteProduct ", deleteProduct.data);
      return res.status(200).json({
        message: 'ok',
        data: deleteProduct.data
      })
    }
    catch (err) {
      return res.status(400).json({
        message: err
      })
    }
  }

  @Get('')
  async getAll(@Res() res: Response) {
    try {
      let findAll = await this.productsService.getAll();
      return res.status(200).json({
        message: "ok",
        data: findAll.data
      })
    }
    catch (err) {
      return res.status(400).json({
        message: err
      })
    }

  }
  @Post('create-product')
  @UseInterceptors(FileInterceptor('product'))
  async uploadFile(@Body() body: any, @UploadedFile() file: Express.Multer.File, @Res() res: Response) {
    try {
      console.log("file", file);
      let data = JSON.parse(body.data);
      console.log("data", data);
      let fileName: string = `img_${Date.now() * Math.random()}.${file.mimetype.split('/')[1]}`
      writeFileSync('public/product/' + fileName, file.buffer)
      let imageProduct: string = `${process.env.SV_HOST}/product/${fileName}`
      console.log("image, product ", imageProduct);

      let newProduct = await this.productsService.create(data, imageProduct);
      if (!newProduct.data) {
        if (newProduct.err.meta.target == 'product_name_key') {
          console.log("Tên sản phẩm đã tồn tại");
        }
      }
      console.log("new Product ", newProduct);
      return res.status(200).json({
        message: "ok",
        data: newProduct.data
      })
    }
    catch (err) {
      return res.status(400).json({
        message: err
      })
    }
  }



}
