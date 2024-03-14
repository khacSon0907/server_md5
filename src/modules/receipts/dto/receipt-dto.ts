export class ReceiptDetailDto {
    id: number;
    name: string;
    quantity: number;
    price: number;
    totalPrice: number;
    productId: number;
    receiptId: number;
}
export class ReceiptDto {
    id: number;
    address: string;
    phoneNumber: string;
    totalAmount: number;
    userId: number;
  }