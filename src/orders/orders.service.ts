import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { HttpService } from '@nestjs/axios';
import { Order } from './entities/order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Request } from 'express';
import { format } from 'date-fns';
import { stringify } from 'querystring';
import { createHmac } from 'crypto';
import { OrderStatus } from './enums/order-status.enum';

@Injectable()
export class OrdersService {
  constructor(private readonly httpService: HttpService,
    @InjectRepository(Order)
    private readonly repository: Repository<Order>,
  ) { }
  async create(createOrderDto: CreateOrderDto, request: Request) {
    const entity = this.repository.create({ amount: 10000 });
    await this.repository.save(entity);
    const ipAddr = request.headers['cf-connecting-ip'] || request.ip
    const tmnCode = 'OL3EGGHN';
    const secretKey = 'PPDJZXUZZWXYEDRFKLOQHACXTIKXCROS';
    let vnpUrl = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';
    const returnUrl = 'https://huynx.mmobysun.com/VnPayReturn';
    const createDate = format(entity.created, 'yyyymmddHHmmss');
    const orderId = entity.id;
    const amount = entity.amount;
    const bankCode: string = '';
    const orderInfo = 'Thanh toan cho ma GD: ' + orderId;
    const orderType = 'other';
    const locale = 'vn';
    const currCode = 'VND';
    let vnp_Params = {};
    vnp_Params['vnp_Version'] = '2.1.0';
    vnp_Params['vnp_Command'] = 'pay';
    vnp_Params['vnp_TmnCode'] = tmnCode;
    // vnp_Params['vnp_Merchant'] = ''
    vnp_Params['vnp_Locale'] = locale;
    vnp_Params['vnp_CurrCode'] = currCode;
    vnp_Params['vnp_TxnRef'] = orderId;
    vnp_Params['vnp_OrderInfo'] = orderInfo;
    vnp_Params['vnp_OrderType'] = orderType;
    vnp_Params['vnp_Amount'] = amount * 100;
    vnp_Params['vnp_ReturnUrl'] = returnUrl;
    vnp_Params['vnp_IpAddr'] = '13.160.92.202';
    vnp_Params['vnp_CreateDate'] = createDate;
    if (bankCode !== null && bankCode !== '') {
      vnp_Params['vnp_BankCode'] = bankCode;
    }
    vnp_Params = this.sortObject(vnp_Params);
    let querystring = require('qs');
    let signData = querystring.stringify(vnp_Params, { encode: false });
    let crypto = require("crypto");
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(signData).digest("hex");
    vnp_Params['vnp_SecureHash'] = signed;
    vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });
    return { vnpUrl }
  }

  findAll() {
    return this.repository.find();
    return `This action returns all orders`;
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }

  async vnpayIPN(query: any) {
    let vnp_Params = query;
    let secureHash = vnp_Params['vnp_SecureHash'];

    let orderId = vnp_Params['vnp_TxnRef'];
    let rspCode = vnp_Params['vnp_ResponseCode'];

    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    vnp_Params = this.sortObject(vnp_Params);
    const secretKey = 'PPDJZXUZZWXYEDRFKLOQHACXTIKXCROS';
    let querystring = require('qs');
    let signData = querystring.stringify(vnp_Params, { encode: false });
    let crypto = require("crypto");
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(signData).digest("hex");
    let paymentStatus = '0'; // Giả sử '0' là trạng thái khởi tạo giao dịch, chưa có IPN. Trạng thái này được lưu khi yêu cầu thanh toán chuyển hướng sang Cổng thanh toán VNPAY tại đầu khởi tạo đơn hàng.
    //let paymentStatus = '1'; // Giả sử '1' là trạng thái thành công bạn cập nhật sau IPN được gọi và trả kết quả về nó
    //let paymentStatus = '2'; // Giả sử '2' là trạng thái thất bại bạn cập nhật sau IPN được gọi và trả kết quả về nó
    const entity = await this.repository.findOneBy({ id: orderId });
    let checkOrderId = true; // Mã đơn hàng "giá trị của vnp_TxnRef" VNPAY phản hồi tồn tại trong CSDL của bạn
    let checkAmount = true; // Kiểm tra số tiền "giá trị của vnp_Amout/100" trùng khớp với số tiền của đơn hàng trong CSDL của bạn
    if (secureHash === signed) { //kiểm tra checksum
      if (checkOrderId) {
        if (checkAmount) {
          if (paymentStatus == "0") { //kiểm tra tình trạng giao dịch trước khi cập nhật tình trạng thanh toán
            if (rspCode == "00") {
              //thanh cong
              //paymentStatus = '1'
              // Ở đây cập nhật trạng thái giao dịch thanh toán thành công vào CSDL của bạn
              entity.status = OrderStatus.SUCCESS;
              await this.repository.save(entity);
              return { RspCode: '00', Message: 'Success' }
            }
            else {
              //that bai
              //paymentStatus = '2'
              // Ở đây cập nhật trạng thái giao dịch thanh toán thất bại vào CSDL của bạn
              entity.status = OrderStatus.ERROR;
              await this.repository.save(entity);
              return { RspCode: '00', Message: 'Success' }
            }
          }
          else {
            return { RspCode: '02', Message: 'This order has been updated to the payment status' }
          }
        }
        else {
          return { RspCode: '04', Message: 'Amount invalid' }
        }
      }
      else {
        return { RspCode: '01', Message: 'Order not found' }
      }
    }
    else {
      return { RspCode: '97', Message: 'Checksum failed' }
    }
  }

  async vnpayReturn(query: any) {
    let vnp_Params = query;

    let secureHash = vnp_Params['vnp_SecureHash'];

    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    vnp_Params = this.sortObject(vnp_Params);

    const secretKey = 'PPDJZXUZZWXYEDRFKLOQHACXTIKXCROS';

    let querystring = require('qs');
    let signData = querystring.stringify(vnp_Params, { encode: false });
    let crypto = require("crypto");
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(signData).digest("hex");
    if (secureHash === signed) {
      //Kiem tra xem du lieu trong db co hop le hay khong va thong bao ket qua
      return { code: vnp_Params['vnp_ResponseCode'] };
    } else {
      return { code: '97' };
    }
  }

  sortObject(obj: any) {
    let sorted = {};
    let str = [];
    let key: any;
    for (key in obj) {
      if (obj.hasOwnProperty(key)) {
        str.push(encodeURIComponent(key));
      }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
      sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
  }
}
