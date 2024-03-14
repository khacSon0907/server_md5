import { Injectable } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { PrimsaService } from '../primsa/primsa.service';

@Injectable()
export class CartService {
  constructor(private prisma: PrimsaService) { }



  async deleteCart(userId: number, productId: number) {
      try{
        const existingCartItem = await this.prisma.carts.findFirst({
          where: {
            userId: userId,
            productId: productId,
          },
        });
        if(existingCartItem){
          return this.prisma.carts.delete({
            where: { id: existingCartItem.id },
          })
        }
      }
      catch(err){
          return {
            err
          }
      }
  }

  async deCrease(userId: number, productId: number,) {
    try {
      const existingCartItem = await this.prisma.carts.findFirst({
        where: {
          userId: userId,
          productId: productId,
        },
      });

      if (existingCartItem) {
        // Nếu sản phẩm đã tồn tại trong giỏ hàng của người dùng, cập nhật số lượng
        if(existingCartItem.quantity == 0){
          return this.prisma.carts.delete({
            where: { id: existingCartItem.id },
          })
        }
        return this.prisma.carts.update({
          where: { id: existingCartItem.id },
          data: {
            quantity: existingCartItem.quantity - 1,
          },
        });
      }
    }
    catch (err) {
      return {
        err
      }
    }
  }

  async inCrease(userId: number, productId: number,) {
    try {
      const existingCartItem = await this.prisma.carts.findFirst({
        where: {
          userId: userId,
          productId: productId,
        },
      });
    
      
    if (existingCartItem) {
      // Nếu sản phẩm đã tồn tại trong giỏ hàng của người dùng, cập nhật số lượng
      const updatedCartItem = await this.prisma.carts.update({
        where: { id: existingCartItem.id },
        data: {
          quantity: existingCartItem.quantity + 1,
        },
      });

      if (updatedCartItem.quantity === 1) {
        // Nếu quantity bằng 0, xóa sản phẩm
        await this.prisma.carts.delete({
          where: { id: existingCartItem.id },
        });
      }

      return updatedCartItem
      }
    }
    catch (err) {
      return {
        err
      }
    }
  }

  async addProductToCart(userId: number, productId: number, quantity: number) {
    const user = await this.prisma.users.findUnique({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }
    const product = await this.prisma.products.findUnique({ where: { id: productId } });
    if (!product) {
      throw new Error('Product not found');
    }
    const existingCartItem = await this.prisma.carts.findFirst({
      where: {
        userId: userId,
        productId: productId,
      },
    });

    if (existingCartItem) {
      // Nếu sản phẩm đã tồn tại trong giỏ hàng của người dùng, cập nhật số lượng
      return this.prisma.carts.update({
        where: { id: existingCartItem.id },
        data: {
          quantity: existingCartItem.quantity + quantity,
        },
      });
    } else {
      // Nếu sản phẩm chưa tồn tại trong giỏ hàng, thêm mới vào giỏ hàng
      return this.prisma.carts.create({
        data: {
          avatar: product.avatar,
          name: product.name,
          price: product.price,
          quantity: quantity,
          userId: userId,
          productId: productId,
        },
      });
    }
  }

  async getAll(userId: number) {
    try {
      let allCart = await this.prisma.carts.findMany({
        where: {
          userId
        }
      })
      return {
        data: allCart
      }

    }
    catch (err) {
      return {
        err
      }
    }
  }
}
