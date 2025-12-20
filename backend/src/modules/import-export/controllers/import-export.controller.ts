import {
  Controller,
  Get,
  Post,
  Query,
  Res,
  Body,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  FileTypeValidator,
  MaxFileSizeValidator,
} from '@nestjs/common';
import { ImportExportService } from '../services/import-export.service';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('import-export')
export class ImportExportController {
  constructor(private readonly importExportService: ImportExportService) {}

  @Get('export')
  @HttpCode(HttpStatus.OK)
  async exportEnterprises(
    @Query() filters: any,
    @Res() res: Response,
  ) {
    const { filePath, fileName } = await this.importExportService.exportEnterprises(filters);
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(fileName)}"`);
    
    res.sendFile(filePath);
  }

  @Post('import')
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(HttpStatus.OK)
  async importEnterprises(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: 'csv|application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
          new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }), // 10MB
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    if (file.mimetype === 'text/csv') {
      return this.importExportService.importEnterprisesFromCSV(file.buffer.toString());
    } else {
      throw new Error('目前仅支持CSV文件导入');
    }
  }

  @Get('template')
  @HttpCode(HttpStatus.OK)
  async getImportTemplate() {
    return this.importExportService.getImportTemplate();
  }
}