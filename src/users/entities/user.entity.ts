import {
  BaseEntity,
  Entity,
  Unique,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ApiProperty } from '@nestjs/swagger';

export enum countryCode {
  KE = 'Kenya',
  TZ = 'Tanzania',
  RWA = 'Rwanda',
  UG = 'Uganda',
}

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @ApiProperty()
  firstName: string;

  @Column({ nullable: true })
  @ApiProperty()
  middleName: string;

  @Column()
  @ApiProperty()
  lastName: string;

  @Column()
  @ApiProperty()
  name: string;

  @Column({ nullable: true })
  @ApiProperty()
  dateOfBirth: Date;

  @Column({
    default: 'NOT SPECIFIED',
    enum: ['MALE', 'FEMALE', 'OTHERS', 'UNKNOWN', 'NOT SPECIFIED'],
  })
  @ApiProperty()
  gender: string;

  @Column({ nullable: true })
  @ApiProperty()
  phone: string;

  @Column()
  @ApiProperty()
  username: string;

  @Column()
  @ApiProperty()
  email: string;

  @Column()
  @ApiProperty()
  password: string;

  @Column({ nullable: true })
  @ApiProperty()
  passwordResetCode: string;

  @Column({ nullable: true })
  @ApiProperty()
  passwordResetLink: string;

  @Column({ nullable: true })
  @ApiProperty()
  passwordResetTime: Date;

  @Column({ nullable: true })
  @ApiProperty()
  passwordChangedTime: Date;

  @Column({ default: false })
  public isEmailConfirmed: boolean;

  @Column({ nullable: true })
  @ApiProperty()
  emailAddressVerificationCode: string;

  @Column({ select: false, nullable: true })
  @ApiProperty()
  authConfirmToken: string;

  @Column({ default: 'KE' })
  @ApiProperty()
  countryCode: string;

  @Column({ default: 'Kenya' })
  @ApiProperty()
  countryName: string;

  @Column({ nullable: true })
  @ApiProperty()
  lastSeenTime: Date;

  @Column({ nullable: true })
  @ApiProperty()
  lastLoginTime: Date;

  @ApiProperty()
  @Column({ default: 'normalUser' })
  role:
    | 'regionalAdmin'
    | 'countryAdmin'
    | 'tradersAndPrivateUser'
    | 'normalUser';

  @ApiProperty()
  @Column({ type: 'timestamp', default: () => 'now()' })
  createdAt: Date;

  @ApiProperty()
  @Column({ nullable: true })
  updatedAt: Date | undefined;

  @ApiProperty()
  @Column({ nullable: false })
  salt: string;

  async checkPassword(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt);
    return hash === this.password;
  }
}
