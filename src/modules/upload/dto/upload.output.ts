import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class FileInfo {
  @Field()
  url: string;

  @Field()
  filename: string;

  @Field()
  mimetype: string;

  @Field()
  size: number;
}

@ObjectType()
export class UploadFilesResponse {
  @Field(() => [FileInfo])
  files: FileInfo[];

  @Field()
  description?: string;

  @Field()
  totalSize: number;
}