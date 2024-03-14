import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { Response } from 'express';
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) { }
  @Post('delete')
  async deleteCartItem(@Body() body: any, @Res() res: Response) {
    try {
      let deleteCartitem = await this.cartService.deleteCart(body.userId, body.productId);
      console.log("deleteCartitem ", deleteCartitem);
      return res.status(200).json({
        message: "success",
        data: deleteCartitem
      })
    }
    catch (err) {
      return res.status(404).json({
        message: err
      })
    }
  }

  @Post('decrease')
  async deCrease(@Body() body: any, @Res() res: Response) {
    try {
      console.log("body", body);

      let deCrease = await this.cartService.deCrease(body.userId, body.productId);
      console.log("decrease ", deCrease);
      return res.status(200).json({
        message: "success",
        data: deCrease
      })
    }
    catch (err) {
      return res.status(404).json({
        message: err
      })
    }
  }

  @Post('increase')
  async increase(@Body() body: any, @Res() res: Response) {
    try {
      let inCrease = await this.cartService.inCrease(body.userId, body.productId);
      return res.status(200).json({
        message: "success",
        data: inCrease
      })
    }
    catch (err) {
      return res.status(404).json({
        message: err
      })
    }
  }

  async decrease(@Body() body: any, @Res() res: Response) {
    try {
      console.log("body", body);
      let inCrease = await this.cartService.inCrease(body.userId, body.productId);
      return res.status(200).json({
        message: "success",
        data: inCrease
      })
    }
    catch (err) {
      return res.status(404).json({
        message: err
      })
    }
  }


  @Post()
  async create(@Body() createCartDto: CreateCartDto, @Res() res: Response) {
    try {
      let newCartRes = await this.cartService.addProductToCart(createCartDto.userId, createCartDto.productId, createCartDto.quantity)
      // console.log("new cart res", newCartRes);
      return res.status(200).json({
        message: 'Thành công',
        data: newCartRes
      })
    }
    catch (err) {
      return res.status(400).json({
        messsage: err
      })
    }
  }
  @Post('all')
  async findAll(@Body() body: any, @Res() res: Response) {
    try {
      // console.log("body ", body.userId);
      let allCart = await this.cartService.getAll(body.userId);
      // console.log("all cart user ", allCart.data);

      return res.status(200).json({
        message: "success",
        data: allCart.data
      })
    }
    catch (err) {
      return {
        messsage: err
      }
    }

  }
  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.cartService.findOne(+id);
  // }
  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateCartDto: UpdateCartDto) {
  //   return this.cartService.update(+id, updateCartDto);
  // }
  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.cartService.remove(+id);
  // }
}
