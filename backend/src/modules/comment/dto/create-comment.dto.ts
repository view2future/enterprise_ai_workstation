import { IsString, IsInt, IsOptional, IsArray } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  content: string;

  @IsString()
  targetType: 'ENTERPRISE' | 'POLICY';

  @IsInt()
  targetId: number;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  mentionedIds?: number[];
}
