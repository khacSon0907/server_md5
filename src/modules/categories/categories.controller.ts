import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Response } from 'express';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) { }

  //update
  @Patch(':id')
  async updateCategories(@Res() res: Response, @Param('id') id: string, @Body() body: any) {
    try {
      let updateCategory = await this.categoriesService.editCategory(+body.id, body.title)
      return res.status(200).json({
        message:"update item succes",
        data:updateCategory.data
      })
    }
    catch (err) {
      return res.status(400).json({
        message:err
      })
    }
  }

  //xóa 
  @Delete(':id')
  async deleteCategories(@Res() res: Response, @Param('id') id: string) {
    try {
      let deleteCategory = await this.categoriesService.deleteCategories(+id);
      return res.status(200).json({
        message: "Xóa Thành Công",
        data: deleteCategory.data
      })
    }
    catch (err) {
      res.status(400).json({
        message: "Xóa Thất Bại",
        err: err
      })
    }
  }

  //lấy ra item 
  @Get('all')
  async getAll(@Res() res: Response) {
    try {
      let findAll = await this.categoriesService.getAll();
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

  //tạo mới category
  @Post()
  async createCategory(@Body() body: CreateCategoryDto, @Res() res: Response) {
    try {
      let newCategory = await this.categoriesService.create(body);
      return res.status(200).json({
        message: "ok",
        data: newCategory.data
      })
    }
    catch (err) {
      return res.status(404).json({
        message: err
      })
    }
  }

}
