import { Injectable, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import { USER_REPOSITORY } from '../index';
import { CreateUserDto } from '../dtos/create-user.dto';
import { CredentialsDto } from '../dtos/credentials.dto';

@Injectable()
export class UserService {
  private code;

  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: Repository<User>,
    private mailerService: MailerService,
  ) {
    this.code = Math.floor(10000 + Math.random() * 90000);
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async signup(user: CreateUserDto): Promise<any> {
    try {
      const salt = await bcrypt.genSalt();
      const hash = await bcrypt.hash(user.password, salt);
      const reqBody = {
        fullname: user.username,
        email: user.email,
        password: hash,
        authConfirmToken: this.code,
        salt,
      };
      const newUser = this.userRepository.insert({ ...user, ...reqBody });
      await this.sendConfirmationEmail(reqBody);
      return true;
    } catch (e) {
      // console.log(e);
      return new HttpException(
        e.errorMessage,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async signin(user: CredentialsDto, jwt: JwtService): Promise<any> {
    try {
      const foundUser = await this.userRepository.findOne({
        where: { email: user.email },
      });
      if (foundUser) {
        if (foundUser.isEmailConfirmed) {
          if (bcrypt.compare(user.password, foundUser.password)) {
            const payload = { email: user.email };
            return {
              token: jwt.sign(payload),
            };
          }
        } else {
          return new HttpException(
            'Please verify your account',
            HttpStatus.UNAUTHORIZED,
          );
        }
        return new HttpException(
          'Incorrect username or password',
          HttpStatus.UNAUTHORIZED,
        );
      }
      return new HttpException(
        'Incorrect username or password',
        HttpStatus.UNAUTHORIZED,
      );
    } catch (e) {
      return new HttpException(
        e.errorMessage,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async sendConfirmedEmail(user: User) {
    const { email, username } = user;
    await this.mailerService.sendMail({
      to: email,
      subject: 'Welcome to pims-sps App! Email Confirmed',
      template: 'confirmed',
      context: {
        username,
        email,
      },
    });
  }

  async sendConfirmationEmail(user: any) {
    const { email, username } = await user;
    await this.mailerService.sendMail({
      to: email,
      subject: 'Welcome to Pims-sps App! Confirm Email',
      template: 'confirm',
      context: {
        username,
        code: this.code,
      },
    });
  }

  async verifyAccount(code: string): Promise<any> {
    try {
      const user = await this.userRepository.findOne({
        where: { authConfirmToken: code },
      });
      if (!user) {
        return new HttpException(
          'Verification code has expired or not found',
          HttpStatus.UNAUTHORIZED,
        );
      }
      await this.userRepository.update(
        { authConfirmToken: user.authConfirmToken },
        { isEmailConfirmed: true, authConfirmToken: undefined },
      );
      await this.sendConfirmedEmail(user);
      return true;
    } catch (e) {
      // console.log(e);
      return new HttpException(
        e.errorMessage,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: number): Promise<User> {
    return await this.userRepository.findOne({ where: { id } });
  }

  async getOne(email): Promise<User> {
    return this.userRepository.findOne({ where: { email } });
  }
  async findOneByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne({ where: { email } });
  }
}
