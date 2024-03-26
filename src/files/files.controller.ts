import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors, Res } from '@nestjs/common';
import { FilesService } from './files.service';
import { CreateFileDto } from './dto/create-file.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('files')
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) { }

  @Post()
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './public/upload',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const originalName = file.originalname;
        const fileExtName = extname(originalName);
        const newFileName = file.fieldname + '-' + uniqueSuffix + fileExtName;
        cb(null, newFileName);
      },
    }),
  }))
  async uploadFile(@UploadedFile() file) {
    return file;
  }

  @Get(':fileName')
  serveImage(@Param('fileName') fileName: string, @Res() res: Response) {
    const absolutePath = 'E:\\be-shop\\public\\upload\\' + fileName;
    return res.sendFile(absolutePath);
  }
}