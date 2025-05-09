import { Field, InputType } from '@nestjs/graphql';
import { GraphQLUpload } from 'graphql-upload-ts';
import { FileUpload } from 'graphql-upload-ts';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

@InputType()
export class UploadFilesInput {
  @Field(() => [GraphQLUpload])
  @IsNotEmpty({ message: 'File is required' })
  files: Promise<FileUpload>[];

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(200, { message: 'Description must be less than 200 characters' })
  description?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(50, { message: 'Tags must be less than 50 characters' })
  tags?: string;

}