import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Req } from '@nestjs/common';
import { AuthenService } from './authen.service';
import { CreateAuthenDto } from './dto/create-authen.dto';
import { Response, Request } from 'express';
import { SendMailService, template } from '../send-mail/send-mail.service';
import { until } from '../until';
import { LoginauthenDto } from './dto/login-authen.dto';
import { compareSync, hashSync } from 'bcrypt';

@Controller('authen')
export class AuthenController {
  constructor(private readonly authenService: AuthenService, private sendMailService: SendMailService) { }

  @Post('login')
  async login(@Body() loginauthenDto: LoginauthenDto, @Res() res: Response) {
    try {

      let count = 0;
      for (let i = 0; i < loginauthenDto.loginUser.length; i++) {
        if (loginauthenDto.loginUser[i] == '@') {
          count = 1;
        }
      }
      if (count == 1) {
        let findUser = await this.authenService.loginByEmail(loginauthenDto.loginUser);
        if (!findUser.data) {
          throw "Email không tồn tại"
        }
        if (findUser.data.emailcomfirm === false) {
          throw "Email chưa được xác thực"
        }
        let checkPass = compareSync(loginauthenDto.password, findUser.data.password);
        if (!checkPass == true) {
          throw "Mật khẩu không đúng"
        }

        return res.status(200).json({
          message: "ok",
          token: until.token.createToken(findUser.data, "1d")
        })
      }
      else {
        let findUser = await this.authenService.loginByUserName(loginauthenDto.loginUser);
        if (!findUser.data) {
          throw "username không tồn tại"
        }
        let checkPass = compareSync(loginauthenDto.password, findUser.data.password);
        if (!checkPass == true) {
          throw "Mật khẩu không đúng"
        }
        return res.status(200).json({
          message: "ok",
          data: findUser.data
        })

      }

    }
    catch (err) {
      return res.status(404).json({
        message: err
      })
    }

  }

  @Post('register')
  async register(@Body() createAuthenDto: CreateAuthenDto, @Res() res: Response) {
    try {
      let newUser = await this.authenService.register(createAuthenDto);
      if (!newUser.data) {
        if (newUser.err.meta.target == 'users_username_key') {
          throw ("user name da ton tai")
        }
        if (newUser.err.meta.target == 'users_email_key') {
          throw ("email da ton tai")
        }
      }

      let token = until.token.createToken(newUser.data, String(5 * 60 * 1000));

      this.sendMailService.sendMail(newUser.data.email, "Gửi Email Xác Nhận", template.emailConfrim(newUser.data.username, `${process.env.SV_HOST}/authen/email-confirm/${token}`))

      return res.status(200).json({
        message: 'ok !',
        data: newUser.data
      })
    }
    catch (err) {
      return res.status(404).json({
        message: err
      })

    }
  }

  @Get('data')
  async getdata(@Req() req: Request, @Res() res: Response) {
    try {
      let token = until.token.decodeToken(String(req.headers.token));
      if (!token) {
        throw "Token in valid data!"
      }
      let findUser = await this.authenService.findById(token.id);
      if (!findUser.data) {
        throw "User Không Tồn Tại"
      }
      return res.status(200).json({
        data: findUser.data
      })
    }
    catch (err) {
      return res.status(400).json({
        message:err
      })
    }
  }

  @Get('email-confirm/:token')

  async emailConfirm(@Param('token') token: string, @Res() res: Response) {
    try {
      let tokenData = until.token.decodeToken(token);
      console.log("tokenData", tokenData);
      if (!tokenData) {
        throw "Token in Valid "
      }

      let user = await this.authenService.updateUser(tokenData.email)
      if (user.err) {
        throw " khong tim thay user"
      }
      return res.status(200).send("Email Confirm ok!")
    }
    catch (err) {
      console.log("err", err);

      return res.status(500).json({

        message: err
      })
    }
  }


}
