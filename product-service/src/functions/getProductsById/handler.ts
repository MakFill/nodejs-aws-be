import { Sequelize } from 'sequelize';
import 'source-map-support/register';
import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse, allowHeaders as headers } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { Product, Stock } from '@db/models';
import schema from './schema';

export const getProductsById: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event
): Promise<any> => {
  try {
    const { productId } = event.pathParameters;
    console.log(`GET request: getProductsByID ${productId}`);

    const res = await Product.findOne({
      where: { id: productId },
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

    if (!res) {
      return formatJSONResponse({ response: 'Product not found', statusCode: 404, headers });
    }
    return formatJSONResponse({ response: res, headers });
  } catch (e) {
    console.error('Error during database request executing', e);
    return formatJSONResponse({ response: 'Error during request', statusCode: 500, headers });
  }
};

export const main = middyfy(getProductsById);
