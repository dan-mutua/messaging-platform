import {
  Controller,
  Get,
  Post,
  Render,
  Res,
  Body,
  HttpStatus,
  Req,
  Param,
} from '@nestjs/common';
import { UserService } from './services/users.service';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dtos/create-user.dto';
import { ApiTags, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { CredentialsDto } from './dtos/credentials.dto';

@Controller('user')
@ApiTags('Users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  // @Get()
  // @ApiResponse({ status: 200, description: 'Render the index page.' })
  // @Render('index')
  // // eslint-disable-next-line @typescript-eslint/no-empty-function
  // root() {}
  @Get()
  @ApiResponse({
    status: 200,
    description: 'Returns an array of users',
    type: [User],
  })
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get('/verify')
  @ApiResponse({ status: 200, description: 'Render the verification page.' })
  @Render('verify')
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  VarifyEmail() {}

  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'User registered successfully.' })
  @Post('/signup')
  async Signup(@Body() user: CreateUserDto) {
    return await this.userService.signup(user);
  }

  @ApiBody({ type: CredentialsDto })
  @ApiResponse({ status: 200, description: 'User signed in successfully.' })
  @Post('/signin')
  async Signin(@Body() user: CredentialsDto) {
    return await this.userService.signin(user, this.jwtService);
  }

  @ApiBody({ type: Object })
  @ApiResponse({ status: 200, description: 'Account verified successfully.' })
  @Post('/verify')
  async Varify(@Body() body) {
    return await this.userService.verifyAccount(body.code);
  }

  // @ApiParam({ name: 'id', type: 'number' })
  // @ApiResponse({ status: 200, description: 'User found.' })
  // @ApiResponse({ status: 404, description: 'User not found.' })
  // @Get('/:id')
  // async getOneUser(@Res() response, @Param() param) {
  //   const user = await this.userService.getOne(param.id);
  //   return response.status(HttpStatus.CREATED).json({
  //     user,
  //   });
  // }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'get all users',
    type: User,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findOne(@Param('id') id: string): Promise<User> {
    return this.userService.findOne(+id);
  }
}
