import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { UploadFilesInput } from './dto/upload.input';
import { UploadFilesResponse } from './dto/upload.output';
import { UploadService } from './upload.service';


@Resolver()
export class UploadResolver {
  constructor(private readonly uploadService: UploadService) { }

  @Query(() => String)
  hello() {
    return 'Hello World!';
  }

  @Mutation(() => UploadFilesResponse, { description: 'Files to upload' })
  async uploadFiles(
    @Args('input', { description: 'Files to upload' }) input: UploadFilesInput,
  ): Promise<UploadFilesResponse> {
    return this.uploadService.uploadFiles(input);
  }
}