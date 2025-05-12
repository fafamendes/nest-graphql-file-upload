export class MaxFilesValidator {
  validate(files: any[], maxFiles: number): boolean {
    return Array.isArray(files) && files.length <= maxFiles;
  }

  defaultMessage(maxFiles: number): string {
    return `Você pode enviar no máximo ${maxFiles} arquivos por vez.`;
  }
}