import { Injectable } from '@nestjs/common';
import { PrimsaService } from '../primsa/primsa.service';
import { CartDto } from './dto/cart-dto';
@Injectable()
export class ReceiptsService {
  constructor(private primsa: PrimsaService) { }

  async createReceiptAndDetails(userId:number,addressUser:string,numberUser:string) {

    const user = await this.primsa.users.findUnique({
      where: { id: userId },
      include: { carts: { include: { products: true } } },
    });

     const totalAmount = user.carts.reduce((acc, cart) => acc + cart.price * cart.quantity, 0);

    const createdReceipt = await this.primsa.receipts.create({
      data: {
        address: addressUser,// Thay đổi thành địa chỉ thực tế của người dùng
        phoneNumber: numberUser, // Thay đổi thành số điện thoại thực tế của người dùng
        status: 'done', // Trạng thái mặc định là 'shopping'
        totalAmount: totalAmount, // Khởi tạo tổng số tiền là 0
        userId: userId,
        details :{
          createMany: {
            data: user.carts.map(cart => ({
              name: cart.name,
              quantity: cart.quantity,
              price: cart.price,
              totalPrice: cart.price * cart.quantity,
              productId: cart.productId,
            })),
        }
      },
    },
    include: {
      details: true,
    },
  });

  await this.primsa.carts.deleteMany({
    where: { userId: userId },
  });
    return createdReceipt;
  }
  async  getReceiptsByUserId(userId: number) {
    try {
      const userReceipts = await this.primsa.receipts.findMany({
        where: { userId: userId },
        include: { user: true, details: true },
      });
  
      return { success: true, data: userReceipts };
    } catch (error) {
      return { success: false, error: 'Đã xảy ra lỗi khi lấy hóa đơn: ' + error.message };
    } 
  }
}
