import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import { ReceiptsService } from './receipts.service';
// import { CartDto } from './dto/cart-dto';
import { Response } from 'express';
@Controller('receipts')
export class ReceiptsController {
  constructor(private readonly receiptsService: ReceiptsService) { }

  @Post('create')
  async creatReceipts(@Body() body: any, @Res() res: Response) {
    try {
      console.log("body ", body);
      let creatReceipts = await this.receiptsService.createReceiptAndDetails(body.userId, body.addressUser, body.numberUser)
      return res.status(200).json({
        message: 'successs',
        data: creatReceipts
      })
    }
    catch (err) {
      return res.status(400).json({
        message: err,
      })
    }
  }
  @Post('getUserId')
  async getReceipt(@Body() body: any, @Res() res: Response) {
    try {
      console.log("body ", body);
      let getReceipts = await this.receiptsService.getReceiptsByUserId(body.userId)
      console.log("get ",getReceipts.data);
      return res.status(200).json({
        message: 'successs',
        data: getReceipts
      })
    }
    catch (err) {
      return res.status(400).json({
        message: err,
      })
    }
  }


}
