import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum UserType {
  SUPERUSER = 'SUPERUSER',
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export enum UserGender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  UKNOWN = 'UKNOWN',
  NOT_SPECIFIED = 'NOT_SPECIFIED',
  OTHER = 'OTHER',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
  BLOCKED = 'BLOCKED',
}

export class CreateUserDto {
  @ApiProperty({ type: String })
  @IsNotEmpty({})
  @IsEmail({}, {})
  @MaxLength(200, {})
  email: string;

  @IsNotEmpty({})
  @ApiProperty({ type: String })
  @MaxLength(200, {})
  name: string;

  @IsNotEmpty({})
  @ApiProperty({ type: String })
  @MinLength(6, {})
  password: string;

  @IsNotEmpty({})
  @ApiProperty({ type: String })
  @MinLength(6, {})
  passwordConfirmation: string;

  @IsNotEmpty({})
  @ApiProperty({ type: String })
  firstName: string;

  @IsNotEmpty({})
  @ApiProperty({ type: String })
  lastName: string;

  @ApiProperty({ type: Date })
  dateOfBirth?: Date;

  @IsNotEmpty({})
  @ApiProperty({
    enum: ['MALE', 'FEMALE', 'OTHER', 'UNKNOWN', 'NOT SPECIFIED'],
  })
  gender: UserGender;

  @ApiProperty({ type: String })
  phone?: string;

  @IsNotEmpty({})
  @ApiProperty({ type: String })
  username: string;

  @ApiProperty({ type: String })
  passwordResetCode?: string;

  @ApiProperty({ type: String })
  passwordResetLink?: string;

  @ApiProperty({ type: Date })
  passwordResetTime?: Date;

  @ApiProperty({ type: Date })
  passwordChangedTime?: Date;

  @ApiProperty({ type: String })
  securityPin?: string;

  @ApiProperty({ type: String })
  emailAddressVerificationCode?: string;

  @ApiProperty({ type: String })
  phoneNumberVerificationCode?: string;

  @IsNotEmpty({})
  @ApiProperty({ type: String })
  timezoneName: string;

  @IsNotEmpty({})
  @ApiProperty({ type: String })
  timezoneOffsetSeconds: number;

  @ApiProperty({ type: Date })
  lastSeenTime?: Date;

  @ApiProperty({ type: Date })
  lastLoginTime?: Date;

  @ApiProperty({
    enum: ['SUPERUSER', 'ADMIN', 'USER'],
  })
  type: UserType;

  @IsNotEmpty({})
  @ApiProperty({ enum: ['ACTIVE', 'SUSPENDED', 'INACTIVE', 'BLOCKED'] })
  status: UserStatus;

  @ApiProperty({ type: Date })
  createdAt?: Date;

  @ApiProperty({ type: Date })
  updatedAt?: Date;
}
