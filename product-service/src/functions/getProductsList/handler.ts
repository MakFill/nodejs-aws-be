import { Sequelize } from 'sequelize';
import 'source-map-support/register';
import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse, allowHeaders as headers } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { Product, Stock } from '@db/models';

export const getProductsList: ValidatedEventAPIGatewayProxyEvent<
  never
> = async (): Promise<any> => {
  console.log('GET request: getProductsList');

  try {
    const res = await Product.findAll({
      include: [
        {
          model: Stock,
          attributes: [],
          as: 'stocks',
        },
      ],
      attributes: [
        'id',
        'title',
        'description',
        'price',
        'image',
        [Sequelize.col('stocks.count'), 'count'],
      ],
      raw: true,
    });

    return formatJSONResponse({ response: res, headers });
  } catch (e) {
    console.error('Error during database request executing', e);
    return formatJSONResponse({
      response: 'Error during database request executing',
      statusCode: 500,
      headers,
    });
  }
};

export const main = middyfy(getProductsList);
