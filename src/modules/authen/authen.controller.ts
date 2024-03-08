import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AuthenService } from './authen.service';
import { CreateAuthenDto } from './dto/create-authen.dto';
import { Response, Request } from 'express';
import { SendMailService, template } from '../send-mail/send-mail.service';
import { until } from '../until';
import { LoginauthenDto } from './dto/login-authen.dto';
import { compareSync, hashSync } from 'bcrypt';
import { FileInterceptor } from '@nestjs/platform-express';
import axios from 'axios';
import { writeFileSync } from 'fs';
@Controller('authen')
export class AuthenController {
  constructor(private readonly authenService: AuthenService, private sendMailService: SendMailService) { }
  @Post('changeInfo')
  @UseInterceptors(FileInterceptor('image'))
  async uploadFile(@Body() body: any, @UploadedFile() file: Express.Multer.File, @Res() res: Response) {
    try {
      if (!file) {
        let email = JSON.parse(body.data).email
        let newUserName = JSON.parse(body.data).username
        let findUser = await this.authenService.findByEmail(email)
        let newAvatar = findUser.data.avatar
        let changeUser = await this.authenService.changeInfoUser(email, newUserName, newAvatar)
        return res.status(200).json({
          message: "succes ok ",
          data: changeUser.data
        })
      }
      else {
        let email = JSON.parse(body.data).email
        let newUserName = JSON.parse(body.data).username
        let fileName = `img_${Date.now() * Math.random()}.${file.mimetype.split('/')[1]}`
        writeFileSync('public/avatar/' + fileName, file.buffer)
        let newAvatar = `https://api.nks.io.vn/avatar/${fileName}`
        let changeUser = await this.authenService.changeInfoUser(email, newUserName, newAvatar)
        return res.status(200).json({
          message: "succes ok ",
          data: changeUser.data
        })
      }
    }
    catch (err) {
      return res.status(404).json({
        message: err
      })
    }

  }

  @Post("google-login")
  async loginGoogle(@Body() body: {
    token: string
  }, @Res() res: Response) {
    try {
      let googleRes = await axios.post(`${process.env.GOOLE_URL}${process.env.GOOLGE_KEY}`, {
        idToken: body.token
      })
      let user = await this.authenService.loginByEmail(googleRes.data.users[0].email);

      if (!user.data) {
        let newUser = {
          username: String(Math.ceil(Date.now() * Math.random())),
          password: 'kokoko@979797',
          email: googleRes.data.users[0].email,
          avatar: googleRes.data.users[0].photoUrl,
        }
        let newUserRes = await this.authenService.register(newUser);

        if (!newUserRes.data) {
          throw false
        }
        return res.status(200).json({
          token: until.token.createToken(newUserRes.data, "1d")
        })
      }
      else {
        return res.status(200).json({
          token: until.token.createToken(user.data, "1d")
        })
      }
    }
    catch (err) {
      return res.status(413).json({
        message: err ? err : 'Loi'
      })
    }
  }
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
          token: until.token.createToken(findUser.data, "1d")
        })

      }

    }
    catch (err) {
      return res.status(500).json({
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

  @Post('data')
  async getdata(@Body() body: any, @Res() res: Response) {
    try {
      console.log("body", body.token);
      
      let token = until.token.decodeToken(body.token);
      
      console.log("token ", token);
      
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
    catch (err:any) {
      return res.status(400).json({
        message: err
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
