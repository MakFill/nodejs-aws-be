import { CACHE_MANAGER, Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { Cache } from 'cache-manager';
import axios, { AxiosRequestConfig } from 'axios';

interface IResponse {
  status: number;
  data: string | object;
}

const PRODUCTS = 'products';

@Injectable({ scope: Scope.REQUEST })
export class AppService {
  constructor(
    @Inject(REQUEST) private readonly request: Request,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}
  async getResponse(): Promise<IResponse> {
    const { originalUrl, method, body } = this.request;
    console.log('originalUrl', originalUrl);
    console.log('method', method);
    console.log('body', body);

    const [, recipient, ...path] = originalUrl.split('/');
    const recipientURL = process.env[recipient];
    console.log('recipientURL', recipientURL);

    if (originalUrl === 'products' && method === 'GET') {
      const data: IResponse['data'] = await this.cacheManager.get(PRODUCTS);
      console.log('FROM CACHE:', data);
      if (data) return { status: 200, data };
    }

    if (recipientURL) {
      const axiosConfig: AxiosRequestConfig = {
        method: method,
        url: `${recipientURL}/${path.join('/')}`,
        ...(Object.keys(body || {}).length > 0 && { data: body }),
      };

      console.log('axiosConfig', axiosConfig);

      try {
        const { status, data } = await axios(axiosConfig);
        console.log('response from recipient', data);
        if (originalUrl === 'products' && method === 'GET') {
          const isTimerSeted = await this.cacheManager.get(PRODUCTS);
          if (!isTimerSeted) console.log('SET TO CACHE');
          await this.cacheManager.set(PRODUCTS, data, { ttl: 120 });
        }

        return { status, data };
      } catch (err) {
        console.log('some error', JSON.stringify(err));

        if (err.response) {
          const { status, data } = err.response;

          return { status, data };
        } else {
          return { status: 500, data: err.message };
        }
      }
    } else {
      return { status: 502, data: { error: 'Cannot process request' } };
    }
  }
}
