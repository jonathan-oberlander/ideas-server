import { IsOptional, IsString } from 'class-validator';

export class UpdateIdeaDto {
  @IsString()
  @IsOptional()
  idea: string;

  @IsString()
  @IsOptional()
  description: string;
}
