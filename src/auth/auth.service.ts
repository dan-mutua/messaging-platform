import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import { UserService } from '../users/services/users.service';
import { USER_REPOSITORY } from 'src/users';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: Repository<User>,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private mailerService: MailerService,
  ) {}

  async validateUser(username: string, pass: string) {
    // find if user exist with this email
    const user = await this.userService.findOneByEmail(username);
    if (!user) {
      return null;
    }

    // find if user password match
    const match = await this.comparePassword(pass, user.password);

    if (!match) {
      return null;
    }

    const { password, ...result } = user;
    return result;
  }

  public async login(user) {
    const token = await this.generateToken(user);
    return { user, token };
  }

  public async create(user) {
    // create the user
    const newUser = await this.userService.signup(user);

    // generate token
    const token = await this.generateToken(Object.assign({}, newUser));
    //send confirmationemail
    await this.sendConfirmedEmail(newUser);
    return true;

    // return the user and the token
    return { user: newUser, token };
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
      return new HttpException(
        e.errorMessage,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private async generateToken(user) {
    const token = await this.jwtService.signAsync(user);
    return token;
  }

  private async hashPassword(password) {
    const hash = await bcrypt.hash(password, 10);
    return hash;
  }

  private async comparePassword(enteredPassword, dbPassword) {
    const match = await bcrypt.compare(enteredPassword, dbPassword);
    return match;
  }
}
