import { All, Controller, Header, Res } from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @All('*')
  @Header('content-type', 'application/json')
  async getResponse(@Res() res: Response): Promise<void> {
    const response = await this.appService.getResponse();
    res.status(response.status).json(response.data);
  }
}
