import { Client } from 'pg';
import 'source-map-support/register';
import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse, allowHeaders as headers } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import dbOptions from '../../db/dbOptions';

import schema from './schema';

export const getProductsById: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event
): Promise<any> => {
  const client = new Client(dbOptions);

  try {
    const { productId } = event.pathParameters;
    console.log(`GET request: getProductsByID ${productId}`);
    await client.connect();

    const { rows } =
      (await client.query(
        `SELECT p.id, p.description, p.price, p.title, p.image, s.count FROM products p  LEFT JOIN stocks s on p.id=s.product_id WHERE p.id='${productId}'`
      )) || {};

    if (!rows.length) {
      return formatJSONResponse({ response: 'Product not found', statusCode: 404, headers });
    }
    return formatJSONResponse({ response: rows, headers });
  } catch (e) {
    console.error('Error during database request executing', e);
    return formatJSONResponse({ response: 'Error during request', statusCode: 500, headers });
  } finally {
    client.end();
  }
};

export const main = middyfy(getProductsById);
