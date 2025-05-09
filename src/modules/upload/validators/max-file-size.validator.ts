import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import { FileUpload } from 'graphql-upload-ts';

@ValidatorConstraint({ name: 'MaxFileSize', async: true })
export class MaxFileSizeValidator implements ValidatorConstraintInterface {
  async validate(files: Promise<FileUpload>[], args: ValidationArguments) {
    const [maxSize] = args.constraints;

    for (const filePromise of files) {
      const file = await filePromise;
      if (file.mimetype && file.createReadStream) {
        const stream = file.createReadStream();
        let size = 0;

        await new Promise((resolve) => {
          stream.on('data', (chunk) => {
            size += chunk.length;
            if (size > maxSize) {
              stream.destroy();
              resolve(false);
            }
          });
          stream.on('end', () => resolve(true));
        });

        if (size > maxSize) return false;
      }
    }

    return true;
  }

  defaultMessage(args: ValidationArguments) {
    const [maxSize] = args.constraints;
    return `Cada arquivo deve ter no máximo ${maxSize / (1024 * 1024)}MB`;
  }
}