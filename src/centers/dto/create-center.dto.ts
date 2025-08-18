import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export enum DayOfWeek {
  MON = 'MON',
  TUE = 'TUE',
  WED = 'WED',
  THU = 'THU',
  FRI = 'FRI',
  SAT = 'SAT',
  SUN = 'SUN',
}

export enum DocumentType {
  MUNICIPAL_HABILITATION = 'MUNICIPAL_HABILITATION',
  PLAN_APPROVED = 'PLAN_APPROVED',
  PROTOCOL = 'PROTOCOL',
  OTHER = 'OTHER',
}

export class CreateCenterDto {
  @ApiProperty()
  @IsString()
  @MaxLength(200)
  name!: string;

  @ApiProperty()
  @IsString()
  @MaxLength(250)
  address!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(80)
  zone?: string;

  @ApiProperty({ required: false, example: 6 })
  @IsOptional()
  @IsInt()
  capacity?: number;

  @ApiProperty({ required: false, example: -34.612345 })
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @ApiProperty({ required: false, example: -58.433221 })
  @IsOptional()
  @IsNumber()
  longitude?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ required: false, enum: DayOfWeek })
  @IsOptional()
  @IsEnum(DayOfWeek)
  startDay?: DayOfWeek;

  @ApiProperty({ required: false, enum: DayOfWeek })
  @IsOptional()
  @IsEnum(DayOfWeek)
  endDay?: DayOfWeek;

  @ApiProperty({ required: false, example: '08:00' })
  @IsOptional()
  @IsString()
  openTime?: string;

  @ApiProperty({ required: false, example: '18:00' })
  @IsOptional()
  @IsString()
  closeTime?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  respFullName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  respPhone?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  respLicense?: string;
}

export class UpdateCenterDto extends PartialType(CreateCenterDto) {}

export class AddDocumentsDto {
  @ApiProperty({ enum: DocumentType }) type!: DocumentType;
  @ApiProperty() url!: string;
  @ApiProperty({ required: false }) filename?: string;
  @ApiProperty({ required: false }) mime?: string;
  @ApiProperty({ required: false }) size?: number;
}
