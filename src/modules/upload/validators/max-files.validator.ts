import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

@ValidatorConstraint({ name: 'MaxFiles', async: false })
export class MaxFilesValidator implements ValidatorConstraintInterface {
  validate(files: any[], args: ValidationArguments) {
    const [maxFiles] = args.constraints;
    return files.length <= maxFiles;
  }

  defaultMessage(args: ValidationArguments) {
    const [maxFiles] = args.constraints;
    return `Você pode enviar no máximo ${maxFiles} arquivos por vez`;
  }
}