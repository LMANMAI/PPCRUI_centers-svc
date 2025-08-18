import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateCenterDto {
  @IsString() @IsNotEmpty() name: string;
  @IsString() @IsNotEmpty() address: string;
  @IsString() @IsNotEmpty() zone: string;
}
export class UpdateCenterDto {
  @IsString() @IsOptional() name?: string;
  @IsString() @IsOptional() address?: string;
  @IsString() @IsOptional() zone?: string;
}
export class CenterDto {
  id: string;
  name: string;
  address: string;
  zone: string;
}
