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

@Controller('data')
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
    @UploadedFile() file: Express.Multer.File,
  ) {
    // 自动兼容各种 CSV 编码
    const content = file.buffer.toString('utf-8');
    return this.importExportService.importEnterprisesFromCSV(content);
  }

  @Get('template')
  @HttpCode(HttpStatus.OK)
  async getImportTemplate() {
    return this.importExportService.getImportTemplate();
  }
}