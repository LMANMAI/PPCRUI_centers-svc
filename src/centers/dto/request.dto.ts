// src/centers/dto/request.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateCenterDto, UpdateCenterDto } from './create-center.dto';

export enum CenterRequestType {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
}

export class CreateCenterRequestDto {
  @ApiProperty({ enum: CenterRequestType, default: CenterRequestType.CREATE })
  @IsEnum(CenterRequestType)
  type: CenterRequestType = CenterRequestType.CREATE;

  @ApiProperty()
  @ValidateNested()
  @Type(() => CreateCenterDto)
  payload!: CreateCenterDto;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  createdBy?: string;
}

export class UpdateCenterRequestDto {
  @ApiProperty({ enum: CenterRequestType, default: CenterRequestType.UPDATE })
  @IsEnum(CenterRequestType)
  type: CenterRequestType = CenterRequestType.UPDATE;

  @ApiProperty()
  @IsNumber()
  centerId!: number;

  @ApiProperty()
  @ValidateNested()
  @Type(() => UpdateCenterDto)
  payload!: UpdateCenterDto;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  createdBy?: string;
}

export class DeleteCenterRequestDto {
  @ApiProperty({ enum: CenterRequestType, default: CenterRequestType.DELETE })
  @IsEnum(CenterRequestType)
  type: CenterRequestType = CenterRequestType.DELETE;

  @ApiProperty()
  @IsNumber()
  centerId!: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  reason?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  createdBy?: string;
}

export class ReviewRequestDto {
  @ApiProperty()
  @IsNumber()
  requestId!: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  reviewNote?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  reviewedBy?: string;
}
